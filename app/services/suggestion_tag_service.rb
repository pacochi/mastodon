# frozen_string_literal: true

class SuggestionTagService < BaseService

  def create(order, tag_name, desc)
    tag = Tag.find_by(name: tag_name)
    unless tag.present?
      tag = Tag.new(name: tag_name)
    end

    if SuggestionTag.find_by(tag_id: tag.id).present?
      raise ActiveSupport::DeprecationException
    end

    suggestion = SuggestionTag.new(order: order, tag_name: tag_name, description: desc, tag: tag)
    unless suggestion.save
      raise 'Save failed'
    end
  end
end

