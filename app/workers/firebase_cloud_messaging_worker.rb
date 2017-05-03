# frozen_string_literal: true

class FirebaseCloudMessagingWorker
  include Sidekiq::Worker

  def perform(notification_id, recipient_id)
    @notification = Notification.find(notification_id)
    @recipient = Account.find(recipient_id)

    I18n.with_locale(@account.user.locale || I18n.default_locale) do
      send_push_notifications
    end
  end

  def send_push_notifications
    data = JSON.parse(InlineRenderer.render(@notification, @recipient, 'firebase_cloud_messagings/push_notification'))

    @account.user.firebase_cloud_messaging_tokens.each do |firebase_cloud_messaging_token|
      FirebaseCloudMessagingApi.publish(firebase_cloud_messaging_token.token, data)
    end
  end
end
