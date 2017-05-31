# frozen_string_literal: true

class FeedInsertWorker
  include Sidekiq::Worker

<<<<<<< HEAD
  def perform(status_id, follower_ids)
    status = Status.find(status_id)
    followers = Account.where(id: follower_ids)

    # TODO: reduce N+1 queries to filter followers
    followers = followers.reject do |follower|
      FeedManager.instance.filter?(:home, status, follower.id)
    end

    FeedManager.instance.push(:home, followers, status)
  rescue ActiveRecord::RecordNotFound
    true
=======
  attr_reader :status, :follower

  def perform(status_id, follower_id)
    @status = Status.find_by(id: status_id)
    @follower = Account.find_by(id: follower_id)

    check_and_insert
  end

  private

  def check_and_insert
    if records_available?
      perform_push unless feed_filtered?
    else
      true
    end
  end

  def records_available?
    status.present? && follower.present?
  end

  def feed_filtered?
    FeedManager.instance.filter?(:home, status, follower.id)
  end

  def perform_push
    FeedManager.instance.push(:home, follower, status)
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc
  end
end
