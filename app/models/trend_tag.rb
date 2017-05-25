# frozen_string_literal: true

class TrendTag
  include ActiveModel::Model
  TREND_CURRENT_KEY = 'trend_current'

  attr_accessor :name, :description, :tag_type

  def self.find_tags(limit = 3)
    trend_cache = Redis.current.get(TrendTag::TREND_CURRENT_KEY)
    trend_tags = []

    if trend_cache.present?
      trend_tags = JSON.parse(trend_cache, {:symbolize_names => true}).take(3).map do |tag|
        # NOTE: 本来はdescriptionにトゥート件数を表示したいが、現状表示するほどトゥートがないので空を出している
        new(name: tag[:tag_name], description: '', tag_type: 'trend')
      end
    end

    suggestion_tags = SuggestionTag.order(:order).preload(:tag).first(limit).map do |tag|
      new(name: tag.name, description: tag.description, tag_type: 'suggestion')
    end

    trend_tags.concat(suggestion_tags).dup(&:name).take(limit)
  end
end
