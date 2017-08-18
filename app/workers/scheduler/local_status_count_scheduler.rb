# frozen_string_literal: true
require 'sidekiq-scheduler'

class Scheduler::LocalStatusCountScheduler
  include Sidekiq::Worker

  def perform
    redis.setex('local_status_count', 15.minutes, Status.local.count)
  end

  private

  def redis
    Redis.current
  end
end
