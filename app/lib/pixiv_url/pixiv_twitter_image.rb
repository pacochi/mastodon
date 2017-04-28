module PixivUrl
  module PixivTwitterImage
    EXPIRES_IN = 12.hours

    class << self
      def cache_or_fetch(url, force: false)
        return unless PixivUrl.valid_pixiv_url?(url)

        Rails.cache.fetch(cache_key(url), expires_in: EXPIRES_IN, force: force) do
          fetch_image_url(url)
        end
      end

      def cache_exists?(url)
        Rails.cache.exist?(cache_key(url))
      end

      private

      def cache_key(url)
        "#{self.class}:image_url:#{url}"
      end

      def fetch_image_url(url)
        response = client.get(url, headers: { 'Referer' => "https://#{Rails.configuration.x.local_domain}" })
        return unless response.status == 200

        html = Nokogiri::HTML.parse(response.body.to_s)
        html.xpath('/html/head/meta[@property="twitter:image"]/@content').to_s
      end

      def client
        HTTP.headers(
          user_agent: FetchLinkCardService::USER_AGENT
        ).timeout(:per_operation, write: 10, connect: 10, read: 10).follow
      end
    end
  end
end
