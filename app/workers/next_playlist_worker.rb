# frozen_string_literal: true

class NextPlaylistWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'playlist'

  def perform(deck, item_id)
    # プレイリストが削除済みでも、配信を続ける
    playlist = Playlist.find_or_initialize_by(deck: deck)
    playlist.next(item_id)
  rescue Mastodon::PlaylistItemNotFoundError
    nil
  end
end
