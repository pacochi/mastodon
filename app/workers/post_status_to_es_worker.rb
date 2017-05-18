# frozen_string_literal: true

class PostStatusToESWorker
  include Sidekiq::Worker
  sidekiq_options queue: :es

  def perform(status_id)
    Status.post_status_to_es_async(status_id)
  end
end
