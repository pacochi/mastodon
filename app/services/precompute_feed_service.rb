# frozen_string_literal: true

class PrecomputeFeedService < BaseService
  LIMIT = FeedManager::MAX_ITEMS / 4

  def call(account)
    @account = account
    populate_feed
  end

  private

  attr_reader :account

  def populate_feed
    redis.pipelined do
<<<<<<< HEAD
      # NOTE: Added `id desc, account_id desc` to `ORDER BY` section to optimize query.
      Status.as_home_timeline(account).order(account_id: :desc).limit(FeedManager::MAX_ITEMS / 4).each do |status|
        next if status.direct_visibility? || FeedManager.instance.filter?(:home, status, account.id)
        redis.zadd(FeedManager.instance.key(:home, account.id), status.id, status.reblog? ? status.reblog_of_id : status.id)
=======
      statuses.each do |status|
        process_status(status)
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc
      end
    end
  end

  def process_status(status)
    add_status_to_feed(status) unless skip_status?(status)
  end

  def skip_status?(status)
    status.direct_visibility? || status_filtered?(status)
  end

  def add_status_to_feed(status)
    redis.zadd(account_home_key, status.id, status.reblog? ? status.reblog_of_id : status.id)
  end

  def status_filtered?(status)
    FeedManager.instance.filter?(:home, status, account.id)
  end

  def account_home_key
    FeedManager.instance.key(:home, account.id)
  end

  def statuses
    Status.as_home_timeline(account).order(account_id: :desc).limit(LIMIT)
  end

  def redis
    Redis.current
  end
end
