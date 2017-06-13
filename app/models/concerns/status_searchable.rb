module StatusSearchable
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model

    index_name 'pawoo_music'
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
              char_filter: ['icu_normalizer']
            }
          }
        }
      }
    }

    settings status_search_es_settings do
      mappings dynamic: 'false' do
        indexes :id, type: 'long'
        indexes :account_id, type: 'integer'
        indexes :text, type: 'text', analyzer: 'ja_text_analyzer'
        indexes :language, type: 'keyword'
        indexes :created_at, type: 'date', format: 'date_time'
      end
    end

    def as_indexed_json(options = {})
      if postable_to_es?
        {
          id: id,
          account_id: account_id,
          text: Formatter.instance.plaintext_for_elasticsearch(self),
          language: language,
          created_at: created_at,
        }
      else
        {}
      end
    end
  end

  class_methods do
    def search(query, exclude_ids)
      __elasticsearch__.search({
        query: {
          bool: {
            must: {
              simple_query_string: {
                query: query,
                fields: ['text'],
                default_operator: 'and'
              }
            },
            must_not: {
              terms: {
                account_id: exclude_ids
              }
            }
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
