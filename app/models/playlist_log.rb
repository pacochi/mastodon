class PlaylistLog < ApplicationRecord
  belongs_to :account, required: true
  belongs_to :skipped_account, class_name: 'Account'

  validates :uuid, uniqueness: true, presence: true
  validates :deck, presence: true, inclusion: { in: 1..3 }
  validates :link, presence: true
end
