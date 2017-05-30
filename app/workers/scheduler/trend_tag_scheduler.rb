# frozen_string_literal: true

class Scheduler::TrendTagScheduler
  include Sidekiq::Worker

  def perform
    tag_names = TrendTagService.new.call
    logger.info(tag_names)
  end
end
