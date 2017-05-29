# Allow elasticsearch
hosts = Elasticsearch::Model.client.transport.hosts
allows = hosts.map { |host| [host[:host], host[:port]].compact.join(':') }
WebMock.disable_net_connect!(allow: allows)

RSpec.configure do |config|
  # Drop & Create index
  config.before do |example|
    Status.__elasticsearch__.create_index!(force: true) if example.metadata[:refresh_elasticsearch]
  end
end
