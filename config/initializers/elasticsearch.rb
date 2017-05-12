Elasticsearch::Model.client = Elasticsearch::Client.new hosts: [
  {host: '192.168.42.1',
    port: '9200',
    user: 'elastic',
    password: 'changeme'
  }]
