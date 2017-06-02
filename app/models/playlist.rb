# frozen_string_literal: true

require 'time'

class Playlist

  MAX_QUEUE_SIZE = 10
  MAX_ADD_COUNT = 2
  MAX_SKIP_COUNT = 1
  attr_accessor queue_items

  def add(add_queue_item, account)
    last_one_hour = Time.current - 1.hour...Time.current
    if MAX_QUEUE_SIZE < queue_items.size || MAX_ADD_COUNT < ControlLog.where(account: account, type: 'add_queue_item', created_at: last_one_hour).count
      nil
    else
      @queue_items += QueueItem.new(
        id: add_queue_item.id,
        title: add_queue_item.id,
        artist: add_queue_item.artist,
        thumbnail_url: add_queue_item.thumbnail_url,
        music_url: add_queue_item.music_url,
        link: add_queue_item.link,
        source_type: add_queue_item.source_type,
        account: add_queue_item.account
      )
    end

  end

  def skip(skip_queue_item, account)
    last_one_hour = Time.current - 1.hour...Time.current
    if MAX_SKIP_COUNT < ControlLog.where(account: account, type: 'skip_queue_item', created_at: last_one_hour).count
      return nil
    end

    target = @queue_items.first
    @queue_items.shift if target.id == skip_queue_item.target
  end
end
