# frozen_string_literal: true

class FeedInsertWorker
  include Sidekiq::Worker

  def perform(status_id, follower_ids)
    status = Status.find(status_id)
    followers = Account.where(id: follower_ids)

    FeedManager.instance.push(:home, followers, status)
  rescue ActiveRecord::RecordNotFound
    true
  end
end
