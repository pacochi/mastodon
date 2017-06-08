# frozen_string_literal: true

class Playlist

  MAX_QUEUE_SIZE = 10
  MAX_ADD_COUNT = 5
  MAX_SKIP_COUNT = 5
  attr_accessor :deck

  def initialize(deck)
    @deck = deck
  end

  def add(link, account)
    return nil unless check_count(music_add_count_key(account), account)

    queue_item = QueueItem.create_from_link(link, account)
    if queue_item && redis_push(queue_item)
      PushPlaylistWorker.perform_async(deck, 'add', queue_item.to_json)
      items = queue_items
      #TODO 同時にアイテムが追加されたときまずそう
      play_item(queue_item.id, queue_item.duration) if items.size == 1
      queue_item
    end
  end

  def skip(id, account)
    return nil unless check_count(music_skip_count_key(account), account)

    self.next(id)
  end

  def next(id)
    if redis_shift(id)
      first_item = queue_items.first

      if first_item
        queue_item = QueueItem.new(queue_items.first)
        play_item(queue_item.id, queue_item.duration)
      end
      true
    end
  end

  def queue_items
    JSON.parse(redis.get(playlist_key) || '[]', symbolize_names: true)
  end

  def set_start_time
    redis.set(start_time_key, Time.now.to_i)
  end

  def current_time_sec
    start_time = redis.get(start_time_key).to_i
    Time.now.to_i - start_time
  end

  private

  def play_item(queue_item_id, duration)
    set_start_time
    NextPlaylistWorker.perform_in(duration, deck, queue_item_id)
    PushPlaylistWorker.perform_async(deck, 'play', id: queue_item_id)
  end

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
      if items.size < MAX_QUEUE_SIZE
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

  def music_add_count_key(account)
    "music:playlist:add-count:#{account.id}"
  end

  def music_skip_count_key(account)
    "music:playlist:skip-count:#{account.id}"
  end

  def check_count(key, account)
    return true if User.find_by(account: account)&.admin

    retry_count = 3
    while retry_count.positive?
      begin
        redis.watch(key) do
          count = redis.get(key)&.to_i || 0
          ttl = redis.ttl(key)
          ttl = 60 * 60 if ttl <= 0

          return false unless count < MAX_ADD_COUNT

          result = redis.multi do |m|
            m.setex(key, ttl, count + 1)
          end
          return true if result
        end
      ensure
        redis.unwatch
        retry_count -= 1
      end
    end

    false
  end

  def redis
    Redis.current
  end

end
