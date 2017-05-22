Elasticsearch::Model.client = Elasticsearch::Client.new(
  hosts: [
    {
      host: ENV['ELASTICSEARCH_HOST'] || '192.168.42.1',
      port: ENV['ELASTICSEARCH_PORT'] || '9200',
      user: ENV['ELASTICSEARCH_USER'] || 'elastic',
      password: ENV['ELASTICSEARCH_PASS'] || 'changeme'
    }
  ]
)
