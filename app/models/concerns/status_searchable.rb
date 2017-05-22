module StatusSearchable
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model

    index_name 'pawoo'
    document_type 'status'

    status_search_es_settings = {
      index: {
        analysis: {
          tokenizer: {
            ja_text_tokenizer: {
              type: 'kuromoji_tokenizer',
              mode: 'search'
            }
          },
          analyzer: {
            ja_text_analyzer: {
              tokenizer: 'ja_text_tokenizer',
              type: 'custom',
              char_filter: ['icu_normalizer'],
              filter: ['kuromoji_part_of_speech']
            }
          }
        }
      }
    }

    settings status_search_es_settings do
      mappings dynamic: 'false' do
        indexes :id, type: 'long'
        indexes :text, type: 'text', analyzer: 'ja_text_analyzer'
        indexes :language, type: 'keyword'
        indexes :created_at, type: 'date', format: 'date_time'
      end
    end

    def as_indexed_json(options = {})
      if postable_to_es?
        {
          id: id,
          text: text,
          language: language,
          created_at: created_at,
        }
      else
        {}
      end
    end

    after_commit on: [:create] do
      if postable_to_es?
        PostStatusToESWorker.perform_async(id)
      end
    end
  end

  class_methods do
    def search(query)
      __elasticsearch__.search({
        query: {
          bool: {
            must: [{
              simple_query_string: {
                query: query,
                fields: ['text'],
                default_operator: 'and'
              }
            }]
          }
        },
        sort: [{
          created_at: {
            order: 'desc',
            missing: '_last'
          }
        }]
      })
    end
  end
end
