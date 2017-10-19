# frozen_string_literal: true

class MusicRegenerationWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull', backtrace: true, unique: :until_executed

  def perform(account_id, _ = :home)
    account = Account.find(account_id)
    PrecomputeMusicFeedService.new.call(account)
  rescue ActiveRecord::RecordNotFound
    true
  end
end
