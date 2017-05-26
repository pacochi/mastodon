# frozen_string_literal: true
require 'sidekiq-scheduler'
require 'time'

class Scheduler::TrendTagScheduler
  include Sidekiq::Worker

  def perform
    result = TrendTagService.new.call(time)
    logger.info result
  end
end
