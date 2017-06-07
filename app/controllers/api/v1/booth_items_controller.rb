# frozen_string_literal: true

class Api::V1::BoothItemsController < ApiController
  BOOTH_ITEMS_KEY_PREFIX = 'booth_items:'
  BOOTH_API_ENDPOINT = 'https://api.booth.pm/pixiv/items/'
  respond_to :json

  def show
    cashe_key = BOOTH_ITEMS_KEY_PREFIX + params[:id]

    # redisから取れるか確認
    booth_item = redis.get(cashe_key)

    # 取れないならAPIを叩く
    unless booth_item
      booth_item = HTTP.get(BOOTH_API_ENDPOINT + params[:id]).body
      redis.set(cashe_key, booth_item)
    end

    render json: JSON.parse(booth_item)
  end

  private

  def redis
    Redis.current
  end

end
