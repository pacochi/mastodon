# frozen_string_literal: true

module Admin
  class SuggestionTagsController < BaseController

    def index
      @tags = SuggestionTag.all.order(:order)
    end
  end
end
