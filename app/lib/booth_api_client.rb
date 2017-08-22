# frozen_string_literal: true

class BoothApiClient
  PREFIX = 'https://api.booth.pm/pixiv/'

  def item(id)
    response = Request.new(:get, "#{PREFIX}items/#{id}").perform
    json = parse_json(response.body)

    # related: #36
    %w(short_url long_url).each do |sound_url|
      if url = json.dig('body', 'sound', sound_url)
        json['body']['sound'][sound_url] = BoothUrl.new(url).to_img_music_pawoo_domain
      end
    end

    [response.code, json]
  end

  private

  def parse_json(string)
    JSON.parse(string)
  rescue
    {}
  end
end
