# == Schema Information
#
# Table name: pinned_statuses
#
#  id         :integer          not null, primary key
#  account_id :integer          not null
#  status_id  :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class PinnedStatus < ApplicationRecord
  belongs_to :account, required: true, touch: true
  belongs_to :status, required: true, touch: true

  validates :status, uniqueness: { scope: :account_id }
  validate :validate_status_owner, if: %i(account status)
  validate :validate_status_visibility, if: :status

  scope :recent, -> { reorder(id: :desc) }

  private

  def validate_status_owner
    errors.add(:status, :no_permission) unless account == status.account
  end

  def validate_status_visibility
    errors.add(:status, :private) unless status.public_visibility? || status.unlisted_visibility?
  end
end
