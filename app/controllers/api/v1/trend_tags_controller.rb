# frozen_string_literal: true

class Api::V1::TrendTagsController < ApiController

  respond_to :json
  before_action :limit_param!

  def index
    trend_service = TrendService.new
    suggestion_tags = trend_service.find_suggestion(@limit)
    @trend_tags = suggestion_tags + trend_service.find_trend((@limit - suggestion_tags.length).clamp(0, @limit))
  end

  private
    def limit_param!
      params[:limit] ||= 5
      @limit = params[:limit].to_i
      @limit = @limit.clamp(0, 5)
    end
end
