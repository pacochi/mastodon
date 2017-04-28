# frozen_string_literal: true

class FetchPixivTwitterImageWorker
  include Sidekiq::Worker

  sidekiq_options retry: false

  def perform(url)
    PixivUrl::PixivTwitterImage.fetch_or_cache(url)
  end
end
