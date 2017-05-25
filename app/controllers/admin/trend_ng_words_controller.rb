# frozen_string_literal: true

module Admin
  class TrendNgWordsController < BaseController
    before_action :set_ng_word, only: [:edit, :update, :destroy]

    def index
      @ng_words = TrendNgWord.all
    end

    def new
      @ng_word = TrendNgWord.new
    end

    def create
      @ng_word = TrendNgWord.new(ng_word_params)
      if @ng_word.save
        redirect_to admin_trend_ng_words_path, notice: 'NGワードを追加しました'
      else
        render :new, status: :unprocessable_entity
      end
    end

    def edit; end

    def update
      if @ng_word.update(ng_word_params)
        redirect_to admin_trend_ng_words_path, notice: 'NGワードを更新しました'
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def destroy
      @ng_word.destroy
      redirect_to admin_trend_ng_words_path, notice: 'NGワードを削除しました'
    end

    private

    def set_ng_word
      @ng_word = TrendNgWord.find(params[:id])
    end

    def ng_word_params
      params.require(:trend_ng_word).permit(:word, :memo)
    end
  end
end
