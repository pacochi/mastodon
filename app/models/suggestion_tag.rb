class SuggestionTag < ApplicationRecord
  attr_accessor :tag_name
  belongs_to :tag
end
