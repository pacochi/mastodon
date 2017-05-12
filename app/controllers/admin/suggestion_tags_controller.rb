# frozen_string_literal: true

module Admin
  class SuggestionTagsController < BaseController

    def index
      @tags = SuggestionTag.all.order(:order)
    end

    def show
      @tag = SuggestionTag.find(params[:id])
    end

    def update
      SuggestionTag.find(params[:id]).update(order: params[:order], description: params[:description])
    end
  end
end
