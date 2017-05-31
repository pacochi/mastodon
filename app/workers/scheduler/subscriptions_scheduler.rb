# frozen_string_literal: true
<<<<<<< HEAD
=======
require 'sidekiq-scheduler'
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc

class Scheduler::SubscriptionsScheduler
  include Sidekiq::Worker

  def perform
    logger.info 'Queueing PuSH re-subscriptions'

    expiring_accounts.pluck(:id).each do |id|
      Pubsubhubbub::SubscribeWorker.perform_async(id)
    end
  end

  private

  def expiring_accounts
    Account.expiring(1.day.from_now).partitioned
  end
end
