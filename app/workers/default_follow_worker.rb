# frozen_string_literal: true

class DefaultFollowWorker
  include Sidekiq::Worker

  def perform(account_id)
    account = Account.find(account_id)
    default_follow_account = Account.find_by!(username: 'now_playing')
    FollowService.new.call(account, default_follow_account.acct)
  rescue ActiveRecord::RecordNotFound
    nil
  end
end
