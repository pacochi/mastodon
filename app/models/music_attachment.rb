# == Schema Information
#
# Table name: music_attachments
#
#  id                  :integer          not null, primary key
#  media_attachment_id :integer          not null
#  duration            :integer          not null
#  title               :string           not null
#  artist              :string           not null
#  music_file_name     :string
#  music_content_type  :string
#  music_file_size     :integer
#  music_updated_at    :datetime
#  image_file_name     :string
#  image_content_type  :string
#  image_file_size     :integer
#  image_updated_at    :datetime
#

class MusicAttachment < ApplicationRecord

  before_save :truncate_title,  if: :title_changed?
  before_save :truncate_artist, if: :artist_changed?

  belongs_to :media_attachment

  has_attached_file :music
  has_attached_file :image

  validates_attachment_size :music,
                            :image,
                            less_than: 7.megabytes

  validates_attachment_content_type :music,
                                    content_type: ['audio/mp3', 'audio/mpeg']

  validates_attachment_content_type :image,
                                    content_type: ['image/jpeg', 'image/png']

  private

  def truncate_title
    self.title = self.title.slice(0, 128)
  end

  def truncate_artist
    self.artist = self.artist.slice(0, 128)
  end

end
