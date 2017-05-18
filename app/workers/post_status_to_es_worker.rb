# frozen_string_literal: true

class PostStatusToESWorker
  include Sidekiq::Worker

  def perform(status_id)
    Status.post_status_to_es_async(status_id)
  end
end
