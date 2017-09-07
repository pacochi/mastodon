# frozen_string_literal: true

class DefaultFollowWorker
  include Sidekiq::Worker

  DEFAULT_FOLLOW_USERS = %w(pixiv pawoo_support).freeze

  def perform(account_id)
    account = Account.find(account_id)
    Account.where(username: DEFAULT_FOLLOW_USERS, domain: nil).each do |default_follow_account|
      FollowService.new.call(account, default_follow_account.acct)
    end
  end
end
