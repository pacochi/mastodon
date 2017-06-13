# frozen_string_literal: true

class QueueItem
  include ActiveModel::Model
  include ActiveModel::Serialization

  attr_accessor :id, :info, :thumbnail_url, :music_url, :video_url, :duration, :link, :source_type, :source_id, :account_id

  class << self
    include RoutingHelper
    include HttpHelper

    YOUTUBE_API_KEY = ENV['YOUTUBE_API_KEY']

    def create_from_link(link, account)
      return if link.blank?
      pawoo_link(link, account) || booth_link(link, account) || apollo_link(link, account) || youtube_link(link, account)
    end

    private

    def pawoo_link(link, account)
      status_id = find_status_id(link)
      return unless status_id

      cache = find_cache('pawoo-music', status_id)
      return set_uuid(cache) if cache

      video = MediaAttachment.video.joins(:status).find_by(statuses: { id: status_id, visibility: [:public, :unlisted] })
      return unless video&.music_info

      video_url = full_asset_url(video.file.url(:original))

      item = new(
        id: SecureRandom.uuid,
        info: "#{video.music_info['title']} - #{video.music_info['artist']}",
        thumbnail_url: nil,
        music_url: nil,
        video_url: video_url,
        link: link,
        duration: video.music_info['duration'],
        source_type: 'pawoo-music',
        source_id: status_id,
        account_id: account.id
      )

      cache_item('pawoo-music', status_id, item)
    end

    def find_status_id(link)
      matched = link.match(%r{https?://#{Rails.configuration.x.local_domain}/((@\w+)|(web/statuses))/(?<status_id>\d+)})
      matched ? matched[:status_id] : nil
    end

    def find_apollo_shop_id(link)
      matched = link.match(%r{https?://booth\.pm/apollo/a\d+/item\?.*id=(?<shop_id>\d+)})
      matched ? matched[:shop_id] : nil
    end

    def apollo_link(link, account)
      shop_id = find_apollo_shop_id(link)
      return unless shop_id

      cache = find_cache('apollo', shop_id)
      return set_uuid(cache) if cache

      json = JSON.parse(http_client.get("https://api.booth.pm/pixiv/items/#{shop_id}").body.to_s)

      return if json['body']['sound'].nil? || json['body']['adult']

      user_or_shop_name = json['body']['shop']['user']['nickname'] || json['body']['shop']['name']
      item = new(
        id: SecureRandom.uuid,
        info: "#{json['body']['name']} - #{user_or_shop_name}",
        thumbnail_url: json['body']['primary_image']['url'],
        music_url: BoothUrl.new(json['body']['sound']['long_url']).to_img_pawoo_music_domain,
        video_url: nil,
        duration: json['body']['sound']['duration'],
        link: link,
        source_type: 'apollo',
        source_id: shop_id,
        account_id: account.id,
      )

      cache_item('apollo', shop_id, item)
    end

    def booth_link(link, account)
      shop_id = find_shop_id(link)
      return unless shop_id

      cache = find_cache('booth', shop_id)
      return set_uuid(cache) if cache

      json = JSON.parse(http_client.get("https://api.booth.pm/pixiv/items/#{shop_id}").body.to_s)

      return if json['body']['sound'].nil? || json['body']['adult']

      user_or_shop_name = json['body']['shop']['user']['nickname'] || json['body']['shop']['name']
      item = new(
        id: SecureRandom.uuid,
        info: "#{json['body']['name']} - #{user_or_shop_name}",
        thumbnail_url: json['body']['primary_image']['url'],
        music_url: BoothUrl.new(json['body']['sound']['long_url']).to_img_pawoo_music_domain,
        video_url: nil,
        duration: json['body']['sound']['duration'],
        link: link,
        source_type: 'booth',
        source_id: shop_id,
        account_id: account.id,
      )

      cache_item('booth', shop_id, item)
    end

    def find_shop_id(link)
      matched = link.match(%r{https://([a-z0-9][a-z0-9\-]+[a-z0-9]\.booth\.pm|booth\.pm/(zh-tw|zh-cn|ko|ja|en))/items/(?<item_id>\d+)})
      matched ? matched[:item_id] : nil
    end

    def youtube_link(link, account)
      video_id = find_youtube_id(link)
      return unless video_id

      cache = find_cache('youtube', video_id)
      return set_uuid(cache) if cache

      title = fetch_youtube_title(link)
      return unless title

      duration_sec = fetch_youtube_duration(video_id)

      item = new(
        id: SecureRandom.uuid,
        info: title,
        thumbnail_url: nil,
        music_url: nil,
        video_url: link,
        link: link,
        duration: duration_sec,
        source_type: 'youtube',
        source_id: video_id,
        account_id: account.id
      )
      cache_item('youtube', video_id, item)
    end

    def fetch_youtube_duration(video_id)
      url = "https://www.googleapis.com/youtube/v3/videos?key=#{YOUTUBE_API_KEY}&part=contentDetails&id=#{video_id}"
      json = JSON.parse(http_client.get(url).body.to_s)
      return if json['items'].blank?
      item = json['items'].first
      duration = item['contentDetails']['duration']
      matched = duration.match(%r{PT(\d+H)?(\d+M)?(\d+S)?})
      return unless matched

      hour = matched[1]&.slice(/\d+/)&.to_i || 0
      minute = matched[2]&.slice(/\d+/)&.to_i || 0
      second = matched[3]&.slice(/\d+/)&.to_i || 0

      second + minute * 60 + hour * 60 * 60
    end

    def fetch_youtube_title(link)
      url = "https://www.youtube.com/oembed?url=#{link}"
      body = http_client.get(url).body.to_s
      return if body == 'Unauthorized'

      json = JSON.parse(body)
      json['title']
    end

    def find_youtube_id(link)
      matched = link.match(%r{https://www\.youtube\.com/watch\?(.*)})
      params = matched ? matched[1] : nil
      if params
        matched = params.match(%r{v=([^&]+)})
        return matched[1] if matched
      end
      matched = link.match(%r{https://youtu\.be/([^/^?]+)})
      matched ? matched[1] : nil
    end

    def set_uuid(item)
      item.id = SecureRandom.uuid
      item
    end

    def find_cache(type, source_id)
      cache = redis.get("music:link:#{type}:#{source_id}")
      cache ? new(JSON.parse(cache, symbolize: true)) : nil
    end

    def cache_item(type, source_id, item)
      redis.setex("music:link:#{type}:#{source_id}", 3600, item.to_json)
      item
    end

    def redis
      Redis.current
    end
  end
end
