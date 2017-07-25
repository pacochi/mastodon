# frozen_string_literal: true

class Api::V1::PlaylistsController < Api::BaseController
  respond_to :json

  def index
    settings = Setting.playlist
    playlists = Playlist.order(:deck)
    decks = playlists.map do |playlist|
      {
        number: playlist.deck,
        type: playlist.deck_type,
        name: playlist.name,
        write_protect: playlist.write_protect,
      }
    end

    render json: {
      settings: settings,
      decks: decks,
    }
  end

  def show
    playlist = Playlist.find_by!(deck: params[:deck])
    items = playlist.queue_items

    render json: {
      deck: {
        number: playlist.deck,
        time_offset: items.blank? ? 0 : playlist.current_time_sec,
        queues: items,
      },
    }
  end
end
