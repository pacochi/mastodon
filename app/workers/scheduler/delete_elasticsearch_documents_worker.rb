# frozen_string_literal: true

class Scheduler::DeleteElasticsearchDocumentsWorker
  EXPIRE_BEFORE = 14.days

  def perform
    Elasticsearch::Model.client.delete_by_query(
      index: Status.__elasticsearch__.index_name,
      body: {
        query: {
          bool: {
            filter: {
              range: {
                created_at: {
                  lte: EXPIRE_BEFORE.ago
                }
              }
            }
          }
        }
      }
    )
  end
end
