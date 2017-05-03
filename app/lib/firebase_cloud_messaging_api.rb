# frozen_string_literal: true

class FirebaseCloudMessagingApi
  FCM_ENDPOINT = 'https://fcm.googleapis.com'

  class << self
    def publish(to, data)
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

    private

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
