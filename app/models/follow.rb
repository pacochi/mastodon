# frozen_string_literal: true

class Follow < ApplicationRecord
  include Paginable
  include NoDeadlockCallbacks

  belongs_to :account, required: true
  no_deadlock_callback(:account, counter_cache: 'following_count')

  belongs_to :target_account,
             class_name: 'Account',
             required: true
  no_deadlock_callback(:target_account, counter_cache: 'followers_count')

  has_one :notification, as: :activity, dependent: :destroy

  validates :account_id, uniqueness: { scope: :target_account_id }
end
