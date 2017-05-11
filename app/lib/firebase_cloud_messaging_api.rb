# frozen_string_literal: true

class FirebaseCloudMessagingApi
  FCM_ENDPOINT = 'https://fcm.googleapis.com'

  class << self
    def publish(to, data, platform)
      if platform == 'iOS'
        publish_to_ios(to, data)
      else
        publish_to_android(to, data)
      end
    end

    private

    def publish_to_ios(to, data)
      body = {
        to: to,
        notification: {
          title: "",
          body: "Pawoo" # iOSのNotification Share Extensionで書き換えている。iOS側でフックするために空文字列でない必要がある。
        },
        priority: 'high',
        mutable_content: true,
        data: data
      }.to_json

      build_client.post(
        '/fcm/send',
        body,
        headers
      )
    end

    def publish_to_android(to, data)
      body = {
        to: to,
        priority: 'high',
        content_available: true,
        data: data
      }.to_json

      build_client.post(
        '/fcm/send',
        body,
        headers
      )
    end

    def build_client
      Faraday::Connection.new(url: FCM_ENDPOINT) do |client|
        client.adapter(Faraday.default_adapter)
      end
    end

    def headers
      raise 'Missing firebase token' unless Rails.application.secrets.firebase_cloud_messaging_api_key

      {
        'Authorization' => "key=#{Rails.application.secrets.firebase_cloud_messaging_api_key}",
        'Content-Type' => 'application/json'
      }
    end
  end
end
