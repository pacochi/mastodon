# frozen_string_literal: true
require 'sidekiq-scheduler'

class Scheduler::LocalStatusCountScheduler
  include Sidekiq::Worker

  def perform
    Rails.cache.write('local_status_count', Status.local.count, expires_in: 15.minutes)
  end
end
