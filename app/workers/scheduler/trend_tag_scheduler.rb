# frozen_string_literal: true
require 'sidekiq-scheduler'
require 'time'

class Scheduler::TrendTagScheduler
  include Sidekiq::Worker

  def perform
    TrendTagWorker.perform_async(Time.now)
  end
end
