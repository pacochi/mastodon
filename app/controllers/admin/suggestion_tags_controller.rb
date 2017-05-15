# frozen_string_literal: true

module Admin
  class SuggestionTagsController < BaseController
    before_action :set_suggestion_tag, only: [:edit, :update, :destroy]

    def index
      @suggestion_tags = SuggestionTag.order(:order).preload(:tag)
    end

    def new
      @suggestion_tag = SuggestionTag.new(order: 1)
    end

    def create
      SuggestionTag.create_suggestion_tag(resource_params[:order],
                                          resource_params[:tag][:name],
                                          resource_params[:description])
      redirect_to admin_suggestion_tags_url, notice: 'タグを作成しました'
    rescue ActiveRecord::RecordInvalid
      redirect_to admin_suggestion_tags_url, notice: '保存に失敗しました'
    end

    def edit; end

    def update
      @suggestion_tag.update(order: resource_params[:order], description: resource_params[:description])
      redirect_to admin_suggestion_tags_url, notice: 'タグを更新しました'
    end

    def destroy
      @suggestion_tag.destroy
      redirect_to admin_suggestion_tags_url, notice: 'タグを削除しました'
    end

    private

    def set_suggestion_tag
      @suggestion_tag = SuggestionTag.find(params[:id])
    end

    def resource_params
      params.require(:suggestion_tag)
        .permit(:order, :description, tag: [:name])
    end
  end
end
