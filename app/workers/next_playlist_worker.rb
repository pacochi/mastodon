# frozen_string_literal: true

class NextPlaylistWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'playlist'

  def perform(deck, item_id)
    playlist = Playlist.find_by(deck: deck)
    playlist&.next(item_id)
  rescue Mastodon::PlaylistItemNotFoundError
    nil
  end
end
