# frozen_string_literal: true

class Api::V1::PlaylistsController < ApiController
  before_action :set_playlist

  respond_to :json

  def show
    render json: {
      deck: {
        number: params[:deck],
        time_offset: 20, # TODO
        queues: @playlist.queue_items
      },
    }
  end

  private

  def set_playlist
    raise ActiveRecord::RecordNotFound unless [1, 2, 3].include?(params[:deck].to_i)

    @playlist = Playlist.new(params[:deck])
  end
end
