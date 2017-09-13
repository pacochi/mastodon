require 'rails_helper'

RSpec.describe Intent::StatusesController, type: :controller do
  render_views

  describe 'GET #new' do
    before do
      sign_in(user)
      get :new, params: { text: text }
    end

    let(:user) { Fabricate(:user) }
    let(:text) { 'share text' }

    it 'redirect to /share' do
      expect(response).to redirect_to share_path(text: text)
    end
  end
end
