# frozen_string_literal: true

class FirebaseCloudMessagingWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'push'

  def perform(notification_id, recipient_id)
    @notification = Notification.find(notification_id)
    @recipient = Account.find(recipient_id)

    I18n.with_locale(@recipient.user.locale || I18n.default_locale) do
      send_push_notifications
    end
  end

  def send_push_notifications
    data = JSON.parse(InlineRenderer.render(@notification, @recipient, 'firebase_cloud_messagings/push_notification'))

    @recipient.user.firebase_cloud_messaging_tokens.each do |firebase_cloud_messaging_token|
      FirebaseCloudMessagingApi.publish(firebase_cloud_messaging_token.token, data, firebase_cloud_messaging_token.platform)
    end
  end
end
