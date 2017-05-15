class SuggestionTag < ApplicationRecord
  validates :tag_name, presence: true, on: :create
  validates :order, presence: true
  validates :description, presence: true

  attr_accessor :tag_name
  belongs_to :tag
end
