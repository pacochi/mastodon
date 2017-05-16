# frozen_string_literal: true

class Api::V1::TrendTagsController < ApiController
  respond_to :json
  before_action :limit_param!

  def index
    @trend_tags = TrendTag.find_suggestion(@limit)
  end

  private

  def limit_param!
    limit_size = params[:limit] || 5
    @limit = limit_size.to_i.clamp(0, 5)
  end
end
