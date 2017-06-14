# frozen_string_literal: true

class BoothUrl
  APOLLO_URL = %r{https?://booth\.pm/apollo/a\d+/item\?.*id=(?<item_id>\d+)}
  BOOTH_URL = %r{https://(?:[a-z0-9][a-z0-9\-]+[a-z0-9]\.booth\.pm|booth\.pm/(?:zh-tw|zh-cn|ko|ja|en))/items/(?<item_id>\d+)}

  def self.extract_booth_item_id(text)
    entities = Extractor.extract_entities_with_indices(text, extract_url_without_protocol: false)
    urls = entities.map { |entry| entry[:url] }

    item_ids = urls.map do |url|
      id = url.match(APOLLO_URL).try(:[], :item_id) || url.match(BOOTH_URL).try(:[], :item_id)
      id.to_i if id
    end

    item_ids.first
  end

  def initialize(uri)
    @uri = uri
  end

  def to_img_music_pawoo_domain
    return @uri.to_s unless should_replace_domain?

    addressable_uri.dup.tap { |new_uri|
      new_uri.hostname = 'img-music.pawoo.net'
      new_uri.path = "booth#{new_uri.path}"
    }.to_s
  end

  private

  def should_replace_domain?
    addressable_uri &&
      addressable_uri.hostname == 's.booth.pm' &&
      addressable_uri.path.match?(%r{[a-zA-Z0-9\-]+/s/[0-9]+/(?:short|full)/[^/]+\.mp3})
  end

  def addressable_uri
    @addressable_uri ||= Addressable::URI.parse(@uri)
  rescue
    nil
  end
end
