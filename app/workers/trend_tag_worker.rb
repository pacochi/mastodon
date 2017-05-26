# frozen_string_literal: true

class TrendTagWorker
  include Sidekiq::Worker

  def perform(time)
    result = TrendTagService.new.call(time)
    logger.info result
  end
end
