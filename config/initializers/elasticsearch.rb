Elasticsearch::Model.client = Elasticsearch::Client.new hosts: [
  {host: '127.0.0.1',
    port: '9200',
    user: 'elastic',
    password: 'changeme'
  }]
