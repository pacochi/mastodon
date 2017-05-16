#require 'elasticsearch/model'

module StatusSearchable
  extend ActiveSupport::Concern

  included do
    include Elasticsearch::Model
    include Elasticsearch::Model::Callbacks

    index_name  "pawoo"
    document_type "status"

    #  settings index: { ... }
    #mappings dynamic: 'false' do ... end

    def as_indexed_json(options = {})
      if published?
        {
          id: id,
          text: text,
        }
      else
        {}
      end
    end

    after_commit on: [:create] do
      __elasticsearch__.index_document if published?
    end

    after_commit on: [:update] do
      __elasticsearch__.update_document if published?
    end

    after_commit on: [:destroy] do
      __elasticsearch__.delete_document
    end
  end

  def published?
    :visibility == :public
    true
  end

  class_methods do
    def search(query)
      __elasticsearch__.search({
        "query": {
          "simple_query_string": {
            "query": query,
            "fields": ["text"],
            "default_operator": "and"
          }
        },
        "sort": [{
          "@timestamp": {
            "order": "desc",
            "missing": "_last"
          }
        }]
      })
    end
  end

end
