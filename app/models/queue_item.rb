# frozen_string_literal: true

class QueueItem
  include ActiveModel::Model
  include ActiveModel::Serialization

  attr_accessor :id, :info, :thumbnail_url, :music_url, :video_url, :duration, :link, :source_type, :source_id, :account_id

  class << self
    include RoutingHelper
    include HttpHelper

    YOUTUBE_API_KEY = ENV['YOUTUBE_API_KEY']

    def create_from_link(deck, link, account)
      # TODO: 回数制限チェック

      # TODO: linkをパースしてAddQueueItemを作る
      item = pawoo_link(link, account) || booth_link(link, account) || youtube_link(link, account)
      redis.set("music:playlist:#{deck}:#{item.id}", item.to_json) if item

      item
    end

    private

    def pawoo_link(link, account)
      status_id = find_status_id(link)
      return nil unless status_id

      cache = find_item('pawoo', status_id)
      return cache if cache

      video = MediaAttachment.find_by(status_id: status_id, type: MediaAttachment.types[:video])
      return nil unless video

      video_url = full_asset_url(video.file.url(:original))

      item = new(
        id: SecureRandom.uuid,
        info: 'title - artist', # TODO: DBからinfo取ってくる
        thumbnail_url: nil,
        music_url: nil,
        video_url: video_url,
        link: link,
        duration: 0, # TODO: DBからinfo取ってくる
        source_type: 'pawoo',
        source_id: status_id,
        account_id: account.id
      )

      save_item('pawoo', status_id, item)
    end

    def find_status_id(link)
      domain = 'localhost:3000' # TODO: 直す
      matched = link.match(%r{https://pawoo.net/(@\W+)|(web/statuses)/(?<status_id>\d+)})
      matched ? matched[:status_id] : nil
    end

    def booth_link(link, account)
      shop_id = find_shop_id(link)
      return nil unless shop_id

      cache = find_item('booth', shop_id)
      return cache if cache

      json = JSON.parse(http_client.get("https://api.booth.pm/pixiv/items/#{shop_id}").body.to_s)
      # TODO: 音楽かどうかの判定
      user_or_shop_name = json['body']['shop']['user']['nickname'] || json['body']['shop']['name']
      item = new(
        id: SecureRandom.uuid,
        info: "#{json['body']['name']} - #{user_or_shop_name}",
        thumbnail_url: json['body']['primary_image']['url'],
        music_url: json['body']['sound']['long_url'],
        video_url: nil,
        duration: json['body']['sound']['duration'],
        link: link,
        source_type: 'booth',
        source_id: shop_id,
        account_id: account.id,
      )

      save_item('booth', shop_id, item)
    end

    def find_shop_id(link)
      matched = link.match(%r{https://booth\.pm/ja/items/(\d+)})
      matched ? matched[1] : nil
    end

    def youtube_link(link, account)
      id = find_youtube_id(link)
      return nil unless id

      cache = find_item('youtube', id)
      return cache if cache

      duration_sec = fetch_youtube_duration(id)
      title = fetch_youtube_title(link)

      item = new(
        id: SecureRandom.uuid,
        info: title,
        thumbnail_url: nil,
        music_url: nil,
        video_url: link,
        link: link,
        duration: duration_sec,
        source_type: 'youtube',
        source_id: id,
        account_id: account.id
      )
      save_item('youtube', id, item)
    end

    def fetch_youtube_duration(id)
      url = "https://www.googleapis.com/youtube/v3/videos?key=#{YOUTUBE_API_KEY}&part=contentDetails&id=#{id}"
      json = JSON.parse(http_client.get(url).body.to_s)
      return nil if json['items'].blank?
      item = json['items'].first
      duration = item['contentDetails']['duration']
      matched = duration.match(%r{PT(\d+H)?(\d+M)?(\d+S)})
      return nil unless matched

      hour = matched[1]&.slice(/\d+/)&.to_i || 0
      minute = matched[2]&.slice(/\d+/)&.to_i || 0
      second = matched[3]&.slice(/\d+/)&.to_i || 0

      second + minute * 60 + hour * 60 * 60
    end

    def fetch_youtube_title(link)
      url = "https://www.youtube.com/oembed?url=#{link}"
      json = JSON.parse(http_client.get(url).body.to_s)
      json['title']
    end

    def find_youtube_id(link)
      matched = link.match(%r{https:\/\/www\.youtube\.com\/watch\?v=(\w+)})
      matched ? matched[1] : nil
    end

    def skip(deck, account)
      # TODO:
      true
    end

    def find_item(type, id)
      cache = redis.get("music:link:#{type}:#{id}")
      puts 'cache hit!' if cache
      cache ? new(JSON.parse(cache, symbolize: true)) : nil
    end

    def save_item(type, id, item)
      redis.setex("music:link:#{type}:#{id}", 3600, item.to_json)
      item
    end

    def redis
      Redis.current
    end

  end
end
