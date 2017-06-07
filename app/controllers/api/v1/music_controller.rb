# frozen_string_literal: true

class Api::V1::MusicController < ApiController
  before_action -> { doorkeeper_authorize! :write }
  before_action :require_user!

  respond_to :json

  def create
      music = MusicAttachment.new(music_params)
      if music.invalid?
        render json: { error: music.errors.full_messages.first }, status: :unprocessable_entity
        return
      end

      mp4 = MusicConvertService.new.call(music)
      # because MediaAttachment->before_post_process is called as soon as file is loaded,
      # all the values should be written BEFORE file (otherwise they are ignored)
      @media = MediaAttachment.new(
        account: current_user.account,
        music_info: music_params.slice(:title, :artist).merge(duration: music.duration),
        file: mp4,
      )
      begin
        @media.save!
      ensure
        mp4.unlink
      end
  end

  def music_params
    params.permit(:title, :artist, :music, :image)
  end

end
