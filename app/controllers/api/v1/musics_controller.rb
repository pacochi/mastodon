# frozen_string_literal: true

class Api::V1::MusicsController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write }
  before_action :require_user!

  respond_to :json

  def create
    music_duration = update_music_info

    # ffmpeg generates 60 extra silent frames at the end when you generate mp4 from png and mp3
    # we get the length of the mp3 file and trim the output to circumvent this issue
    @music = MusicAttachment.create!(music_params.merge(duration: music_duration.ceil))
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
      m.length
    end
  rescue Mp3InfoError
    raise Mastodon::ValidationError, I18n.t('music_attachments.invalid_mp3')
  end
end
