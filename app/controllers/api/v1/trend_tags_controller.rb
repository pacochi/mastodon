# frozen_string_literal: true

class Api::V1::TrendTagsController < ApiController

  respond_to :json
  before_action :limit_param!

  def index
    trend_service = TrendService.new
    @trend_tags = trend_service.find_suggestion(@limit)
  end

  private
    def limit_param!
      params[:limit] ||= 5
      @limit = params[:limit].to_i
      @limit = @limit.clamp(0, 5)
    end
end
