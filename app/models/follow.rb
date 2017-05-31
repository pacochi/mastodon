# frozen_string_literal: true
# == Schema Information
#
# Table name: follows
#
#  id                :integer          not null, primary key
#  account_id        :integer          not null
#  target_account_id :integer          not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class Follow < ApplicationRecord
  include Paginable

  belongs_to :account, required: true, counter_cache: 'following_count'

  belongs_to :target_account,
             class_name: 'Account',
             required: true,
             counter_cache: 'followers_count'

  has_one :notification, as: :activity, dependent: :destroy

  validates :account_id, uniqueness: { scope: :target_account_id }

  scope :recent, -> { reorder(id: :desc) }
end
