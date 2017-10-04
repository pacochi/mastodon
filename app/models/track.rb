# == Schema Information
#
# Table name: tracks
#
#  id                               :integer          not null, primary key
#  account_id                       :integer          not null
#  status_id                        :integer          not null
#  duration                         :integer          not null
#  title                            :string           not null
#  artist                           :string           not null
#  description                      :string           default(""), not null
#  music_file_name                  :string
#  music_content_type               :string
#  music_file_size                  :integer
#  music_updated_at                 :datetime
#  video_file_name                  :string
#  video_content_type               :string
#  video_file_size                  :integer
#  video_updated_at                 :datetime
#  video_image_file_name            :string
#  video_image_content_type         :string
#  video_image_file_size            :integer
#  video_image_updated_at           :datetime
#  video_blur_movement_band_bottom  :integer          default(0), not null
#  video_blur_movement_band_top     :integer          default(0), not null
#  video_blur_movement_threshold    :integer          default(0), not null
#  video_blur_blink_band_bottom     :integer          default(0), not null
#  video_blur_blink_band_top        :integer          default(0), not null
#  video_blur_blink_threshold       :integer          default(0), not null
#  video_particle_limit_band_bottom :integer          default(0), not null
#  video_particle_limit_band_top    :integer          default(0), not null
#  video_particle_limit_threshold   :integer          default(0), not null
#  video_particle_color             :integer
#  video_spectrum_mode              :integer
#  video_spectrum_color             :integer
#

class Track < ApplicationRecord
  include Paginable

  before_save :truncate_title,       if: :title_changed?
  before_save :truncate_artist,      if: :artist_changed?
  before_save :truncate_description, if: :description_changed?

  belongs_to :account, inverse_of: :tracks
  belongs_to :status, inverse_of: :track
  has_many :album_tracks, inverse_of: :track

  has_attached_file :music
  has_attached_file :video
  has_attached_file :video_image

  validates_attachment_presence :music
  validates_attachment_size :music, :video_image, less_than: 7.megabytes

  validates_attachment_content_type :music,
                                    content_type: ['audio/mpeg']

  validates_attachment_content_type :video_image,
                                    content_type: ['image/jpeg', 'image/png']

  def display_title
    "#{title} - #{artist}"
  end

  private

  def truncate_title
    self.title = self.title.slice(0, 128)
  end

  def truncate_artist
    self.artist = self.artist.slice(0, 128)
  end

  def truncate_description
    self.description = self.description.slice(0, 500)
  end

end
