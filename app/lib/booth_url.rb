# frozen_string_literal: true

class BoothUrl
  def initialize(uri)
    @uri = uri
  end

  def to_img_pawoo_music_domain
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
