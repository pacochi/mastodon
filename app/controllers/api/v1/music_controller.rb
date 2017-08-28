# frozen_string_literal: true

class Api::V1::MusicController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write }
  before_action :require_user!

  respond_to :json

  def create
    music_info = update_music_info

    # ffmpeg generates 60 extra silent frames at the end when you generate mp4 from png and mp3
    # we get the length of the mp3 file and trim the output to circumvent this issue
    music = MusicAttachment.new(music_params.merge(duration: music_info[:duration].ceil))
    music.validate!

    mp4 = MusicConvertService.new.call(**music_params.merge(music_info))

    begin
      # because MediaAttachment->before_post_process is called as soon as file is loaded,
      # all the values should be written BEFORE file (otherwise they are ignored)
      @media = MediaAttachment.create!(
        account: current_user.account,
        file: mp4,
        music_attachment: music,
      )
    ensure
      mp4.unlink
    end
  end

  private

  def music_params
    return @music_params if @music_params

    title, artist, music, image = params.require([:title, :artist, :music, :image])
    @music_params = { title: title, artist: artist, music: music, image: image }
  end

  def update_music_info
    Mp3Info.open music_params[:music].path do |m|
      m.tag2.remove_pictures
      { duration: m.length, bitrate: m.bitrate }
    end
  end
end
