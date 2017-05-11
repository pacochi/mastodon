# frozen_string_literal: true

class Api::V1::TrendTagsController < ApiController

  respond_to :json
  before_action :limit_param!

  def index
    @trend_tags = [
      TrendTag.new(
        'Pawoo人増えたし自己紹介しようぜ',
        'https://pawoo.net/tags/hoge',
        '運営からのおすすめ',
        'suggestion'),
      TrendTag.new(
        'FGO',
        'https://pawoo.net/tags/FGO',
        '2500件のトゥート',
        'trend'),
      TrendTag.new(
        'FGO2',
        'https://pawoo.net/tags/FGO',
        '2500件のトゥート',
        'trend'),
      TrendTag.new(
        'FGO3',
        'https://pawoo.net/tags/FGO',
        '2500件のトゥート',
        'trend'),
      TrendTag.new(
        'FGO4',
        'https://pawoo.net/tags/FGO',
        '2500件のトゥート',
        'trend'),
      TrendTag.new(
        'FGO5',
        'https://pawoo.net/tags/FGO',
        '2500件のトゥート',
        'trend'),
      TrendTag.new(
        'FGO6',
        'https://pawoo.net/tags/FGO',
        '2500件のトゥート',
        'trend'),
    ]

    @trend_tags = @trend_tags.first(@limit)

    render :index
  end

  private
    def limit_param!
      params[:limit] ||= 5
      @limit = params[:limit].to_i
      @limit = @limit.clamp(0, 5)
    end
end
