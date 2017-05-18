#require 'elasticsearch/model'

module StatusSearchable
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model

    index_name  "pawoo"
    document_type "status"

    status_search_es_settings = {
      index: {
        analysis: {
          tokenizer: {
            ja_text_tokenizer: {
              type: "kuromoji_tokenizer",
              mode: "search"
            }
          },
          analyzer: {
            ja_text_analyzer: {
              tokenizer: "ja_text_tokenizer",
              type: "custom",
              char_filter: ["icu_normalizer"],
              filter: ["kuromoji_part_of_speech"]
            }
          }
        }
      }
    }

    settings status_search_es_settings do
      mappings dynamic: 'false' do
        indexes :id, type: 'long'
        indexes :text, type: 'text', analyzer: 'ja_text_analyzer', fielddata: true
        indexes :favourites_count, type: 'integer'
        indexes :reblogs_count, type: 'integer'
        indexes :language, type: 'keyword'
        indexes :created_at, type: 'date', format: 'date_time'
        indexes :is_pawoo, type: 'boolean'
        indexes :visibility, type: 'integer'
      end
    end

    def as_indexed_json(options = {})
      if postable_to_es?
        {
          id: id,
          text: text,
          favourites_count: favourites_count,
          reblogs_count: reblogs_count,
          language: language,
          created_at: created_at,
          is_pawoo: local?,
          visibility: visibility_before_type_cast
        }
      else
        {}
      end
    end

    after_commit on: [:create] do
      if postable_to_es?
        PostStatusToESWorker.perform_async(id)
      else
        Rails.logger.debug 'toot is not sent to ES.@create'
      end
    end

    #after_commit on: [:destroy] do
    #  Rails.logger.debug 'toot is removed from ES async. @destroy'
    #  RemoveStatusFromESWorker.perform_async(id)
    #end

  end

  class_methods do
    def search(query)
      __elasticsearch__.search({
        "query": {
          "bool": {
            "must": [{
              "simple_query_string": {
                "query": query,
                "fields": ["text"],
                "default_operator": "and"
              }
            }],
            "filter": [
                { "term": { "visibility": 0 } },
                { "term": { "is_pawoo": true } }
            ]
          }
        },
        "sort": [{
          "created_at": {
            "order": "desc",
            "missing": "_last"
          }
        }]
      });
    end

    def post_status_to_es_async(status_id)
      Rails.logger.debug 'toot is sent to ES async. @create'
      find(status_id).__elasticsearch__.index_document
    end

    def remove_status_from_es_async(status)
      status.__elasticsearch__.delete_document
    end
  end

end
