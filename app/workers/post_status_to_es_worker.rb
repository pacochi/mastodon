# frozen_string_literal: true

class PostStatusToESWorker
  include Sidekiq::Worker

  def perform(status_id)
    Status.find(status_id).__elasticsearch__.index_document
  end
end
