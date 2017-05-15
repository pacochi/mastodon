# frozen_string_literal: true

class TrendTag
  include ActiveModel::Model

  MOCK_TREND = []

  attr_reader :name, :description, :tag_type

  def self.find_trend(limit = 5)
    MOCK_TREND.first(limit)
  end


  def self.find_suggestion(limit = 3)
    suggestion_tags = SuggestionTag.order(:order).preload(:tag).first(limit)
    suggestion_tags.map do |tag|
      TrendTag.new(name: tag.tag.name, description: tag.description, tag_type: 'suggestion')
    end
  end
end
