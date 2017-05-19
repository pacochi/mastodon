Elasticsearch::Model.client = Elasticsearch::Client.new hosts: [
  {host: ENV['ELASTIC_SEARCH_URL'] || '192.168.42.1',
    port: ENV['ELASTIC_SEARCH_PORT'] || '9200',
    user: ENV['ELASTIC_SEARCH_USER'] || 'elastic',
    password: ENV['ELASTIC_SEARCH_PASS'] || 'changeme'
  }]
