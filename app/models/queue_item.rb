# frozen_string_literal: true

class QueueItem
  include ActiveModel::Model
  include ActiveModel::Serialization

  attr_accessor :id, :info, :thumbnail_url, :music_url, :video_url, :duration, :link, :source_type, :account

  class << self
    include RoutingHelper
    include HttpHelper

    def create(link, account)
      #todo linkをパースしてAddQueueItemを作る
      ret = pawoo_link(link, account)
      return ret if ret
      booth_link(link, account)
    end

    private

    def pawoo_link(link, account)
      domain = 'localhost:3000'
      #todo redisのキャッシュもシュッとやる
      status_id = find_status_id(link, %r{http://#{domain}/web/statuses/(\d+)})
      status_id = find_status_id(link, %r{http://#{domain}/@\W+/(\d+)}) if status_id

      return nil unless status_id
      video = MediaAttachment.find_by(status_id: status_id, type: MediaAttachment.types[:video])
      return nil unless video

      video_url = full_asset_url(video.file.url(:original))

      #todo mp3infoでシュッっとやる

      QueueItem.new(
        id: SecureRandom.uuid, title: 'title',
        artist: 'aaaa',
        thumbnail_url: '',
        music_url: '',
        video_url: video_url,
        link: link,
        duration: 0,
        source_type: 'pawoo', account: account.id
      )
    end

    def find_status_id(link, reg)
      matched = link.match(reg)
      matched ? matched[1] : nil
    end

    def booth_link(link, account)

      shop_id = find_shop_id(link)
      return nil unless shop_id

      cache = Redis.current.get("booth-kink:#{shop_id}")
      if cache
        cache = JSON.parse(cache, symbolize: true)
        return QueueItem.new(cache)
      end

      json = JSON.parse(http_client.get("https://api.booth.pm/pixiv/items/#{shop_id}").body.to_s)
      item = QueueItem.new(
        id: SecureRandom.uuid,
        info: "#{json['body']['name']} #{json['body']['shop']['user']['nickname']}",
        thumbnail_url: json['body']['primary_image']['url'],
        music_url: json['body']['sound']['long_url'],
        video_url: '',
        duration: json['body']['sound']['duration'],
        link: link,
        source_type: 'booth',
        account: account.id,
      )

      Redis.current.set("booth-kink:#{shop_id}", item.to_json)
      item
    end

    def find_shop_id(link)
      matched = link.match(%r{https://booth.pm/ja/items/(\d+)})
      matched ? matched[1] : nil
    end
  end
end
