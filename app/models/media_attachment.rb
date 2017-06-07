# frozen_string_literal: true

class MediaAttachment < ApplicationRecord
  self.inheritance_column = nil

  enum type: [:image, :gifv, :video, :unknown, :music]

  IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'].freeze
  VIDEO_MIME_TYPES = ['video/webm', 'video/mp4'].freeze

  IMAGE_STYLES = { original: '1280x1280>', small: '400x400>' }.freeze
  VIDEO_STYLES = {
    small: {
      convert_options: {
        output: {
          vf: 'scale=\'min(400\, iw):min(400\, ih)\':force_original_aspect_ratio=decrease',
        },
      },
      format: 'png',
      time: 0,
    },
  }.freeze
  MUSIC_STYLES = {
    original: {
      format: 'mp4',
    }
  }.freeze

  belongs_to :account, inverse_of: :media_attachments
  belongs_to :status,  inverse_of: :media_attachments

  has_attached_file :file,
                    styles: ->(f) { file_styles f },
                    processors: ->(f) { file_processors f },
                    convert_options: { all: '-quality 90 -strip' }
  validates_attachment_content_type :file, content_type: IMAGE_MIME_TYPES + VIDEO_MIME_TYPES
  validates_attachment_size :file, less_than: 8.megabytes

  validates :account, presence: true

  scope :attached, -> { where.not(status_id: nil) }
  scope :local, -> { where(remote_url: '') }
  default_scope { order(id: :asc) }

  def local?
    remote_url.blank?
  end

  def file_remote_url=(url)
    self.file = URI.parse(Addressable::URI.parse(url).normalize.to_s)
  end

  def to_param
    shortcode
  end

  before_create :set_shortcode
  before_post_process :set_type_and_extension
  before_save :set_meta

  class << self
    private

    def file_styles(f)
      if f.instance.file_content_type == 'image/gif'
        {
          small: IMAGE_STYLES[:small],
          original: {
            format: 'mp4',
            convert_options: {
              output: {
                'movflags' => 'faststart',
                'pix_fmt'  => 'yuv420p',
                'vf'       => 'scale=\'trunc(iw/2)*2:trunc(ih/2)*2\'',
                'vsync'    => 'cfr',
                'b:v'      => '1300K',
                'maxrate'  => '500K',
                'crf'      => 6,
              },
            },
          },
        }
      elsif IMAGE_MIME_TYPES.include? f.instance.file_content_type
        IMAGE_STYLES
      elsif f.instance.type == 'music' # music file is converted into mp4 before thrown into this module
        MUSIC_STYLES
      else
        VIDEO_STYLES
      end
    end

    def file_processors(f)
      if f.file_content_type == 'image/gif'
        [:gif_transcoder]
      elsif VIDEO_MIME_TYPES.include? f.file_content_type
        [:video_transcoder]
      else
        [:thumbnail]
      end
    end
  end

  private

  def set_shortcode
    self.type = :unknown if file.blank? && !type_changed?

    return unless local?

    loop do
      self.shortcode = SecureRandom.urlsafe_base64(14)
      break if MediaAttachment.find_by(shortcode: shortcode).nil?
    end
  end

  def set_type_and_extension
    self.type = VIDEO_MIME_TYPES.include?(file_content_type) ? :video : :image
    extension = appropriate_extension
    basename  = Paperclip::Interpolations.basename(file, :original)
    file.instance_write :file_name, [basename, extension].delete_if(&:blank?).join('.')
  end

  def set_meta
    # change music file's filetype at this point to handle the converted mp4 as a mere video file in DB
    # we must not change it earlier than here, otherwise the converted mp4 would be meaninglessly converted again by Paperclip
    self.type = :video if file.instance.type == 'music'
    meta = populate_meta
    return if meta == {}
    file.instance_write :meta, meta
  end

  def populate_meta
    meta = {}
    file.queued_for_write.each do |style, file|
      begin
        geo = Paperclip::Geometry.from_file file
        meta[style] = {
          width: geo.width.to_i,
          height: geo.height.to_i,
          size: "#{geo.width.to_i}x#{geo.height.to_i}",
          aspect: geo.width.to_f / geo.height.to_f,
        }
      rescue Paperclip::Errors::NotIdentifiedByImageMagickError
        meta[style] = {}
      end
    end
    meta
  end

  def appropriate_extension
    mime_type = MIME::Types[file.content_type]

    extensions_for_mime_type = mime_type.empty? ? [] : mime_type.first.extensions
    original_extension       = Paperclip::Interpolations.extension(file, :original)

    extensions_for_mime_type.include?(original_extension) ? original_extension : extensions_for_mime_type.first
  end
end
