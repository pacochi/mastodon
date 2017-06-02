class MusicAttachment
  include ActiveModel::Model

  attr_accessor :title, :artist, :music, :image, :account

  validates :account, presence: true
  validates :title, presence: true
  validates :artist, presence: true
  validates :music, presence: true
  validates :image, presence: true
  validates_with MusicValidator

  def initialize(title, artist, music, image, account)
    @title = title; @artist = artist; @music = music; @image = image; @account = account
  end

  def convert
    mp4 = MusicConvertService.new.call(title, artist, music, image)
    return mp4
  end

end
