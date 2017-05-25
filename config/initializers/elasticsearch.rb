Elasticsearch::Model.client = Elasticsearch::Client.new(
  hosts: [
    {
      host: ENV['ELASTICSEARCH_HOST'] || '192.168.42.1',
      port: ENV['ELASTICSEARCH_PORT'] || '9200',
    }
  ]
)
