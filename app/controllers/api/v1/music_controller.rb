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

      mp4 = MusicConvertService.new.call(params[:title], params[:artist], params[:music], params[:image])
      @media = MediaAttachment.new(account: current_user.account, file: mp4, type: MediaAttachment.types[:music])
      mp4.close
      @media.save!
  end

  def music_params
    params.permit(:title, :artist, :music, :image)
  end

end
