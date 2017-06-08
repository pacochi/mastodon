# frozen_string_literal: true

class NextPlaylistWorker
  include Sidekiq::Worker

  def perform(deck, item_id)
    playlist = Playlist.new(deck)
    playlist.next(item_id)
  end
end
