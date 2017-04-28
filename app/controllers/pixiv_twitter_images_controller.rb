# frozen_string_literal: true

class PixivTwitterImagesController < ApplicationController
  def create
    url = params[:url].to_s

    if PixivUrl.valid_pixiv_url?(url) && !PixivUrl::PixivTwitterImage.cache_exists?(url)
      FetchPixivTwitterImageWorker.perform_async(url)
    end

    head :no_content
  end
end
