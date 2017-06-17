# frozen_string_literal: true

class Playlist

  MAX_QUEUE_SIZE = 10
  MAX_ADD_COUNT = 5
  MAX_SKIP_COUNT = 2
  SKIP_LIMT_TIME = 90
  attr_accessor :deck

  MEDIA_TL_DECK_ID = 346

  def initialize(deck)
    @deck = deck
  end

  def add(link, account, force = false)
    count = redis.get(music_add_count_key(account))&.to_i || 0
    raise Mastodon::PlayerControlLimitError if control_limit?(count, account, force)

    queue_item = QueueItem.create_from_link(link, account)
    raise Mastodon::MusicSourceNotFoundError if queue_item.nil?

    retry_count = 3
    add_count_key = music_add_count_key(account)
    while retry_count.positive?
      begin
        redis.watch(playlist_key, add_count_key) do
          count = redis.get(music_add_count_key(account))&.to_i || 0
          raise Mastodon::PlayerControlLimitError if control_limit?(count, account, force)

          items = queue_items
          raise Mastodon::PlaylistSizeOverError unless items.size < MAX_QUEUE_SIZE

          ttl = redis.ttl(add_count_key)
          ttl = 60 * 60 if ttl <= 0
          result = redis.multi do |m|
            items.push(queue_item)
            m.set(playlist_key, items.to_json)
            m.setex(add_count_key, ttl, count + 1)
          end

          if result
            PushPlaylistWorker.perform_async(deck, 'add', queue_item.to_json)
            PlaylistLog.create(
              account: account,
              uuid: queue_item.id,
              deck: deck,
              link: link,
              info: queue_item.info,
            )
            play_item(queue_item.id, queue_item.duration, 0) if items.size == 1
            return queue_item
          end
        end
      ensure
        retry_count -= 1
        redis.unwatch
      end
    end
    raise Mastodon::RedisMaxRetryError
  end

  def skip(id, account)
    skip_count_key = music_skip_count_key(account)
    count = redis.get(skip_count_key)&.to_i || 0

    unless account&.user.admin
      raise Mastodon::PlayerControlSkipLimitTimeError if current_time_sec < SKIP_LIMT_TIME
      raise Mastodon::PlayerControlLimitError unless count < MAX_SKIP_COUNT
    end

    ret = self.next(id)
    return false unless ret

    PlaylistLog.find_by(uuid: id)&.update(skipped_at: Time.now, skipped_account: account)

    ttl = redis.ttl(skip_count_key)
    ttl = 60 * 60 if ttl <= 0

    redis.multi do |m|
      m.incr(skip_count_key)
      m.expire(skip_count_key, ttl)
    end
    true
  end

  def next(id)
    if redis_shift(id)
      PushPlaylistWorker.perform_async(deck, 'end', { id: id }.to_json)
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

  def control_limit?(count, account, force)
    MAX_ADD_COUNT <= count && (!account.user.admin || !force)
  end

  def play_item(queue_item_id, duration, gap = 10)
    set_start_time
    NextPlaylistWorker.perform_in(duration + gap, deck, queue_item_id)
    PushPlaylistWorker.perform_async(deck, 'play', { id: queue_item_id }.to_json)
    PlaylistLog.find_by(uuid: queue_item_id)&.update(started_at: Time.now)
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
        begin
          items = yield queue_items
          if items
            res = redis.multi do |m|
              m.set(playlist_key, items.to_json)
            end

            return true if res
          else
            return false
          end
        ensure
          redis.unwatch
        end
      end
      retry_count -= 1
    end
    raise Mastodon::RedisMaxRetryError
  end

  def redis_push(item)
    update_queue_items do |items|
      if items.size < MAX_QUEUE_SIZE
        items.push(item)
      else
        raise Mastodon::PlaylistSizeOverError
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
        raise Mastodon::PlaylistEmptyError
      end
    end
  end

  def music_add_count_key(account)
    "music:playlist:add-count:#{account.id}"
  end

  def music_skip_count_key(account)
    "music:playlist:skip-count:#{account.id}"
  end

  def redis
    Redis.current
  end

end
