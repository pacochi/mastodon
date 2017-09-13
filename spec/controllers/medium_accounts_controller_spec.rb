require 'rails_helper'

RSpec.describe MediumAccountsController, type: :controller do
  render_views

  let(:alice)  { Fabricate(:account, username: 'alice') }

  describe 'GET #media' do
    it 'redirect to short_account_media_path' do
      page = 2
      Rails.application.routes.recognize_path('/users/accounts/media')
      get :index, params: { account_username: alice.username, page: page }
      expect(response).to redirect_to short_account_media_path(username: alice.username, page: page)
    end
  end
end
