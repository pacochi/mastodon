# frozen_string_literal: true

class Api::V1::MusicController < ApiController
  # before_action -> { doorkeeper_authorize! :write }
  # before_action :require_user!

  respond_to :json

  def create
    mp4 = MusicConvertService.new.call(media_params[:title], media_params[:artist], media_params[:music], media_params[:picture])
    @media = MediaAttachment.new(account: current_user.account, file: mp4, type: MediaAttachment.types[:music])
    @media.save!(validate: false)
    mp4.close
  end

  private

  def media_params
    # params.permit(:music, :image, :title, :artist)
    params
  end

end
