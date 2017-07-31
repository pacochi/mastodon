require 'rails_helper'

describe Admin::PlaylistSettingsController, type: :controller do
  render_views

  let(:params) { {
    max_queue_size: 10,
    max_add_count: 10,
    max_skip_count: 2,
    skip_limit_time: 10,
    replay_history_num: 30
  } }

  before do
    sign_in Fabricate(:user, admin: true), scope: :user
  end

  describe 'PATCH #update' do
    subject do
      -> { patch :update, params: params }
    end

    it 'redirects to admin playlists page' do
      subject.call
      expect(response).to redirect_to(admin_playlists_path)
    end
  end
end
