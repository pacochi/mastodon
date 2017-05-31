<<<<<<< HEAD
require 'sidekiq'
require 'sidekiq/scheduler'
require 'sidekiq-scheduler'

host = ENV.fetch('REDIS_HOST') { 'localhost' }
port = ENV.fetch('REDIS_PORT') { 6379 }
password = ENV.fetch('REDIS_PASSWORD') { false }
db = ENV.fetch('REDIS_DB') { 0 }

Sidekiq.configure_server do |config|
  config.redis = { host: host, port: port, db: db, password: password }

  config.on(:startup) do
    Sidekiq.schedule = YAML.load_file(File.expand_path('../../sidekiq_scheduler.yml', __FILE__))
    Sidekiq::Scheduler.reload_schedule!
  end
=======
# frozen_string_literal: true

namespace = ENV.fetch('REDIS_NAMESPACE') { nil }
redis_params = { url: ENV['REDIS_URL'] }

if namespace
  redis_params [:namespace] = namespace
end

Sidekiq.configure_server do |config|
  config.redis = redis_params
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc
end

Sidekiq.configure_client do |config|
  config.redis = redis_params
end
