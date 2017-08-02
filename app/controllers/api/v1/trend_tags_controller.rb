# frozen_string_literal: true

class Api::V1::TrendTagsController < Api::BaseController
  respond_to :json

  def index
    # iOSアプリではおすすめタグの場所にコミケタグを表示する
    # is_ios_app = request.env['HTTP_USER_AGENT'].start_with?('PawooiOSApp/')
    # TODO: コミケのときに有効化する
    is_ios_app = false

    if is_ios_app
      limit = 30
      suggestion_type = :comiket
    else
      limit_size = params[:limit] || 5
      limit = limit_size.to_i.clamp(0, 10)
      suggestion_type = :normal
    end
    @trend_tags = TrendTag.find_tags(limit, suggestion_type)
  end
end
