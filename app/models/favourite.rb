# frozen_string_literal: true

class Favourite < ApplicationRecord
  include Paginable
  include NoDeadlockCallbacks

  belongs_to :account, inverse_of: :favourites, required: true
  belongs_to :status,  inverse_of: :favourites, required: true
  no_deadlock_callback(:status, counter_cache: true)

  has_one :notification, as: :activity, dependent: :destroy

  validates :status_id, uniqueness: { scope: :account_id }

  before_validation do
    self.status = status.reblog if status&.reblog?
  end
end
