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
    Rails.logger.debug queue_item
    if queue_item && redis_push(queue_item)
      PushPlaylistWorker.perform_async(@deck, 'add', queue_item.to_json)
    end
  end

  def skip(id, account)
    # TODO: 回数チェック
    # last_one_hour = Time.current - 1.hour...Time.current
    # if MAX_SKIP_COUNT < ControlLog.where(account: account, type: 'skip_queue_item', created_at: last_one_hour).count
    #   return nil
    # end

    if redis_shift(id)
      item = queue_items.first
      if item
        PushPlaylistWorker.perform_async(deck, 'play', id: id)
        # TODO: 曲の再生が終わるころにskipを実行するやつをsidekiqに積む
      end
      true
    end
  end

  def queue_items
    JSON.parse(redis.get(playlist_key) || '[]', symbolize_names: true)
  end

  private

  def playlist_key
    "music:playlist:#{@deck}"
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
      Rails.logger.debug items
      Rails.logger.debug items.size
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
