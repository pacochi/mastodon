class MusicAttachment
  include ActiveModel::Model

  attr_accessor :title, :artist, :music, :image

  validates :title, presence: true
  validates :artist, presence: true
  validates :music, presence: true
  validates :image, presence: true
  validates_with MusicValidator

  def music=(value)
    @music = value
    # remove cover images if exist (to simplify mimetype decision)
    Mp3Info.open value.path do |m|
      m.tag2.remove_pictures
    end
  end

  def duration
    Mp3Info.open(music.path, &:length).ceil
  end

end
