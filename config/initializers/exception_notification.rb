require 'exception_notification/rails'

ExceptionNotification.configure do |config|
  config.ignored_exceptions += %w(
    ActionController::InvalidAuthenticityToken
    ActionController::BadRequest
    ActionController::UnknownFormat
  )

  config.ignore_if do |_exception, _options|
    !Rails.env.production?
  end

  if Rails.application.secrets.slack['error_webhook_url'] && Rails.application.secrets.slack['error_channel']
    config.add_notifier :slack,
      webhook_url: Rails.application.secrets.slack['error_webhook_url'],
      channel: Rails.application.secrets.slack['error_channel']
  end
end
