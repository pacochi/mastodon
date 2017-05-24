class TrendNgWord < ApplicationRecord
  validates :word, uniqueness: true
end
