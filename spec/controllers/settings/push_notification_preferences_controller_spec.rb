require 'rails_helper'

describe Settings::PushNotificationPreferencesController do
  render_views

  let(:user) { Fabricate(:user) }

  before do
    sign_in user, scope: :user
  end

  describe 'GET #show' do
    it 'returns http success' do
      get :show
      expect(response).to have_http_status(:success)
    end
  end

  describe 'PUT #update' do
    it 'updates firebase_cloud_messaging_tokens settings' do
      user.settings['notification_firebase_cloud_messagings'] = user.settings['notification_firebase_cloud_messagings'].merge('follow' => false)
      user.settings['interactions'] = user.settings['interactions'].merge('must_be_follower' => true)

      put :update, params: {
        user: {
          notification_firebase_cloud_messagings: { follow: '1' },
          interactions: { must_be_follower: '0' },
        }
      }

      expect(response).to redirect_to(settings_push_notification_preferences_path)
      user.reload
      expect(user.settings['notification_firebase_cloud_messagings']['follow']).to be true
      expect(user.settings['interactions']['must_be_follower']).to be false
    end
  end
end
