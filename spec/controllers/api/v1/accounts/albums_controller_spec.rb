# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::Accounts::AlbumsController, type: :controller do
  describe 'GET #index' do
    render_views

    let(:account) { Fabricate(:account) }

    it 'returns albums of a specific account' do
      self_album = Fabricate(:album, status: Fabricate(:status, account: account))
      anothers_album = Fabricate(:album)

      get :index, params: { account_id: account.id }

      expect(body_as_json.pluck(:id)).to match_array [self_album.id]
    end

    it 'returns ordered albums with id constraints' do
      albums = 3.times.map do
        Fabricate(:album, status: Fabricate(:status, account: account))
      end

      get :index, params: { account_id: account.id, since_id: albums[0], max_id: albums[2] }

      expect(body_as_json.pluck(:id)).to match_array [albums[1].id]
    end

    it 'returns ordered albums with limit constraint' do
      albums = 2.times.map do
        Fabricate(:album, status: Fabricate(:status, account: account))
      end

      get :index, params: { account_id: account.id, limit: 1 }

      expect(response).to have_http_status :success
      expect(body_as_json.pluck(:id)).to match_array [albums[1].id]
    end

    it 'inserts pagination headers if necessary' do
      albums = 3.times.map do
        Fabricate(:album, status: Fabricate(:status, account: account))
      end

      get :index, params: { account_id: account.id, max_id: albums[2], limit: 1 }

      expect(response.headers['Link'].find_link(['rel', 'next']).href).to eq api_v1_account_albums_url(limit: 1, max_id: albums[1].id)
      expect(response.headers['Link'].find_link(['rel', 'prev']).href).to eq api_v1_account_albums_url(limit: 1, since_id: albums[1].id)
    end

    it 'returns http success' do
      get :index, params: { account_id: account.id }
      expect(response).to have_http_status :success
    end
  end
end
