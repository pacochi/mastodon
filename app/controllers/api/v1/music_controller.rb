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
      binding.pry
      @media = MediaAttachment.new(
        account: current_user.account,
        file: mp4,
        music_info: { title: music_params[:title], artist: music_params[:artist], duration: music.duration },
      )
      binding.pry
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
