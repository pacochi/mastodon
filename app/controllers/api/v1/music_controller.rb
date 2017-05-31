# frozen_string_literal: true

class Api::V1::MusicController < ApiController
  # before_action -> { doorkeeper_authorize! :write }
  # before_action :require_user!

  respond_to :json

  def create
    mp4 = MusicConvertService.new.call(media_params[:title], media_params[:artist], media_params[:music], media_params[:picture])
    @media = MediaAttachment.create!(account: current_user.account, file: mp4, type: MediaAttachment.types[:music])
  rescue Paperclip::Error
    #TODO: エラーメッセージが適切でないのでいいかんじにする
    render json: { error: 'Error processing thumbnail for uploaded media' }, status: 500
  end

  private

  def media_params
    # params.permit(:music, :image, :title, :artist)
    params
  end

end
