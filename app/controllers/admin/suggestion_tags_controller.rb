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
      # TODO: 未完成
      # タグの存在を確認
      tag = Tag.find_by(name:resource_params[:tag_name]);
      # なければ作成
      if !tag.present?
        tag = Tag.new(name:resource_params[:tag_name]);
      end

      resource_params[:tag_id] = tag[:id];
      @suggestion_tag = SuggestionTag.new(resource_params)

      if @suggestion_tag.save
        redirect_to admin_suggetion_tags_path, notice: 'タグを作成しました'
      else
        # render :new
      end
    end

    def edit; end

    def update
      # TODO: 未チェック
      @suggestion_tag.update(order: params[:order], description: params[:description])
      redirect_to admin_suggetion_tags_path, notice: 'タグを更新しました'
    end

    def destroy
      # TODO: 未チェック
      @suggestion_tag.destroy
      redirect_to admin_suggetion_tags_path, notice: 'タグを削除しました'
    end

    private

    def set_suggestion_tag
      @suggestion_tag = SuggestionTag.find(params[:id])
    end

    def resource_params
      params.require(:suggestion_tag).permit(:order, :tag_name, :description)
    end
  end
end
