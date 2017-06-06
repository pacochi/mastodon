# frozen_string_literal: true

class QueueItem
  include ActiveModel::Model
  include ActiveModel::Serialization

  attr_accessor :id, :info, :thumbnail_url, :music_url, :video_url, :duration, :link, :source_type, :account_id

  class << self
    include RoutingHelper
    include HttpHelper

    def create_from_link(deck, link, account)
      # TODO: 回数制限チェック

      # TODO: linkをパースしてAddQueueItemを作る
      item = pawoo_link(link, account) || booth_link(link, account) # || youtube_link(link, account)
      Redis.current.set("music:playlist:#{deck}:#{item.id}", item.to_json) if item

      item
    end

    private

    def pawoo_link(link, account)
      status_id = find_status_id(link)

      cache = Redis.current.get("music:link:pawoo:#{status_id}")
      return new(JSON.parse(cache, symbolize: true)) if cache

      return nil unless status_id
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
        account_id: account.id
      )

      Redis.current.setex("music:link:pawoo:#{status_id}", 3600, item.to_json)
      item
    end

    def find_status_id(link)
      domain = 'localhost:3000' # TODO: 直す
      matched = link.match(%r{https://pawoo.net/(@\W+)|(web/statuses)/(?<status_id>\d+)})
      matched ? matched[:status_id] : nil
    end

    def booth_link(link, account)
      shop_id = find_shop_id(link)
      return nil unless shop_id

      cache = Redis.current.get("music:link:booth:#{shop_id}")
      return new(JSON.parse(cache, symbolize: true)) if cache

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
        account_id: account.id,
      )

      Redis.current.setex("music:link:booth:#{shop_id}", 3600, item.to_json)
      item
    end

    def find_shop_id(link)
      matched = link.match(%r{https://booth.pm/ja/items/(\d+)})
      matched ? matched[1] : nil
    end

    def youtube_link(link, account)
      # TODO:
    end

    def skip(deck, account)
      # TODO:
      true
    end

  end
end
