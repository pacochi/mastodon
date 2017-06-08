# frozen_string_literal: true

class Playlist

  MAX_QUEUE_SIZE = 10
  MAX_ADD_COUNT = 2
  MAX_SKIP_COUNT = 1
  attr_accessor :deck

  def initialize(deck)
    @deck = deck
  end

  def add(link, account)
    # TODO: 回数チェック
    # last_one_hour = Time.current - 1.hour...Time.current
    # if MAX_QUEUE_SIZE < queue_items.size || MAX_ADD_COUNT < ControlLog.where(account: account, type: 'add_queue_item', created_at: last_one_hour).count
    #   return nil
    # end

    queue_item = QueueItem.create_from_link(link, account)
    if queue_item && redis_push(queue_item)
      PushPlaylistWorker.perform_async(deck, 'add', queue_item.to_json)
      items = queue_items
      if items.size == 1
        set_start_time
        PushPlaylistWorker.perform_async(deck, 'play', id: queue_item.id)
        NextPlaylistWorker.perform_in(queue_item.duration, deck, queue_item.id)
      end
    end
  end

  def skip(id, account)
    # TODO: 回数チェック
    # last_one_hour = Time.current - 1.hour...Time.current
    # if MAX_SKIP_COUNT < ControlLog.where(account: account, type: 'skip_queue_item', created_at: last_one_hour).count
    #   return nil
    # end

    self.next(id)
  end

  def next(id)
    if redis_shift(id)
      item = queue_items.first
      if item
        set_start_time
        NextPlaylistWorker.perform_in(item[:duration], deck, item[:id])
        PushPlaylistWorker.perform_async(deck, 'play', id: item[:id])
      end
    end
  end

  def queue_items
    JSON.parse(redis.get(playlist_key) || '[]', symbolize_names: true)
  end

  def set_start_time
    redis.set(start_time_key, Time.now.to_i.to_s)
  end

  def current_time_sec
    start_time = redis.get(start_time_key).to_i
    Time.now.to_i - start_time
  end

  private

  def playlist_key
    "music:playlist:#{deck}"
  end

  def start_time_key
    "music:playlist:time:#{deck}"
  end

  def update_queue_items(retry_count = 3)
    while retry_count.positive?
      redis.watch(playlist_key) do
        items = yield queue_items
        if items
          res = redis.multi do |m|
            m.set(playlist_key, items.to_json)
          end

          return true if res
        else
          redis.unwatch
          return false
        end
      end
      retry_count -= 1
    end
    # TODO: エラー追加
    false
  end

  def redis_push(item)
    update_queue_items do |items|
      if items.size < 10
        items.push(item)
      else
        # TODO: エラー追加
        nil
      end
    end
  end

  def redis_shift(id)
    update_queue_items do |items|
      first_item = items.first
      if first_item && first_item[:id] == id
        items.shift
        items
      else
        # TODO: エラー追加
        nil
      end
    end
  end

  def redis
    Redis.current
  end

end
