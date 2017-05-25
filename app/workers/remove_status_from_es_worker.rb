# frozen_string_literal: true

class RemoveStatusFromESWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'elasticsearch'

  def perform(index_name, document_type, status_id)
    Elasticsearch::Model.client.delete(
      index: index_name,
      type:  document_type,
      id: status_id,
      ignore: 404
    )
  end
end
