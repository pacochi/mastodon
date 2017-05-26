# frozen_string_literal: true

class TrendTag
  include ActiveModel::Model
  TREND_CURRENT_KEY = 'trend_current'

  attr_accessor :name, :description, :tag_type

  def self.find_tags(limit = 3)
    trend_cache = Redis.current.get(TREND_CURRENT_KEY)
    trend_tags = []

    if trend_cache.present?
      trend_ng_words = TrendNgWord.pluck(:word)
      trend_tags = JSON.parse(trend_cache, {:symbolize_names => true}).take(3).map do |tag|
        next if trend_ng_words.any? { |ng_word| tag[:tag_name].include?(ng_word) }
        # NOTE: 本来はdescriptionにトゥート件数を表示したいが、現状表示するほどトゥートがないので空を出している
        new(name: tag[:tag_name], description: '', tag_type: 'trend')
      end
      trend_tags = trend_tags.reject(&:nil?)
    end

    suggestion_tags = SuggestionTag.order(:order).preload(:tag).limit(limit).map do |tag|
      new(name: tag.name, description: tag.description, tag_type: 'suggestion')
    end

    trend_tags.concat(suggestion_tags).group_by(&:name).map(&:last).flatten.take(limit)
  end
end
