# frozen_string_literal: true

class Api::V1::BoothItemsController < ApiController
  BOOTH_ITEMS_KEY_PREFIX = 'booth_items:'
  BOOTH_API_ENDPOINT = 'https://api.booth.pm/pixiv/items/'
  respond_to :json

  def show

    # redisから取れるか確認
    booth_item = redis.get(params[:id])

    # 取れないならAPIを叩く
    unless booth_item
      booth_item = HTTP.get(BOOTH_API_ENDPOINT + params[:id]).body
      redis.set(params[:id], booth_item)
    end

    render json: JSON.parse(booth_item)
  end

  private

  def redis
    Redis::Namespace.new(BOOTH_ITEMS_KEY_PREFIX)
  end
end
