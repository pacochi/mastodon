# frozen_string_literal: true

require 'rails_helper'

describe TracksController, type: :controller do
  render_views

  describe 'GET #new' do
    it 'returns http success when signed in' do
      sign_in Fabricate(:user)
      get :new
      expect(response).to have_http_status :success
    end

    it 'redirects when signed out' do
      get :new
      expect(response).to redirect_to 'http://test.host/about'
    end
  end

  describe 'GET #show' do
    it 'returns http success' do
      track = Fabricate(:track)
      get :show, params: { account_username: track.status.account.username, id: track }
      expect(response).to have_http_status :success
    end
  end
end
