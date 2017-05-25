class TrendNgWord < ApplicationRecord
  validates :word, uniqueness: true, presence: true
end
