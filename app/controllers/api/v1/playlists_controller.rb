# frozen_string_literal: true

class Api::V1::PlaylistsController < ApiController
  before_action :set_playlist

  respond_to :json

  def show
    items = @playlist.queue_items

    render json: {
      deck: {
        number: params[:deck],
        time_offset: items.blank? ? 0 : @playlist.current_time_sec,
        queues: items,
      },
    }
  end

  private

  def set_playlist
    raise ActiveRecord::RecordNotFound unless [1, 2, 3].include?(params[:deck].to_i)

    @playlist = Playlist.new(params[:deck])
  end
end
