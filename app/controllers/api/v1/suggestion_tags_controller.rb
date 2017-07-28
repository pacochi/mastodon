# frozen_string_literal: true

class Api::V1::SuggestionTagsController < Api::BaseController
  respond_to :json

  DEFAULT_SUGGESTION_LIMIT = 30

  def index
    type = SuggestionTag.suggestion_types.include?(params[:type]) ? params[:type] : :normal
    limit = limit_param(DEFAULT_SUGGESTION_LIMIT)

    @suggestion_tags = SuggestionTag.where(suggestion_type: type).limit(limit)
  end
end
