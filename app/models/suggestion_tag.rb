class SuggestionTag < ApplicationRecord
  belongs_to :tag

  validates :order, :description, presence: true
  validates :tag_id, uniqueness: true

  def self.create_suggestion_tag(order, tag_name, desc)
    tag = Tag.find_or_create_by!(name: tag_name)
    SuggestionTag.create!(order: order, description: desc, tag: tag)
  end
end
