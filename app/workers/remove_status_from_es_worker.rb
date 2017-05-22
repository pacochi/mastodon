# frozen_string_literal: true

class RemoveStatusFromESWorker
  include Sidekiq::Worker
  include Elasticsearch::Model
  sidekiq_options queue: 'remove'

  def perform(index_name, document_type, status_id)
    __elasticsearch__.client.delete({
      index: index_name,
      type:  document_type,
      id: status_id,
    })
  end
end
