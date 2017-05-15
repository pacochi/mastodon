# frozen_string_literal: true

module Admin
  class SuggestionTagsController < BaseController

    before_action :set_suggestion_tag, except: [:index, :new, :create]

    def index
      @suggestion_tags = SuggestionTag.all.order(:order)
    end

    def show; end

    def new
      @suggestion_tag = SuggestionTag.new
    end

    def create

      begin
        tag_service = SuggestionTagService.new
        tag_service.create(resource_params[:order],
                           resource_params[:tag_name],
                           resource_params[:description])
      rescue ActiveSupport::DeprecationException => _
        redirect_to admin_suggestion_tags_url, notice: 'すでに存在するタグです'
        return
      rescue StandardError => _
        redirect_to admin_suggestion_tags_url, notice: '保存に失敗しました'
        return
      end
      redirect_to admin_suggestion_tags_url, notice: 'タグを作成しました'
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
        .permit(:order, :tag_name, :description)
    end
  end
end
