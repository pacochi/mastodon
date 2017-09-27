# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::Accounts::TracksController, type: :controller do
  describe 'GET #index' do
    render_views

    let(:account) { Fabricate(:account) }

    it 'returns tracks of a specific account' do
      self_track = Fabricate(:music_attachment, status: Fabricate(:status, account: account))
      anothers_track = Fabricate(:music_attachment)

      get :index, params: { account_id: account.id }

      expect(body_as_json.pluck(:id)).to match_array [self_track.id]
    end

    it 'returns ordered tracks with id constraints' do
      tracks = 3.times.map do
        Fabricate(:music_attachment, status: Fabricate(:status, account: account))
      end

      get :index, params: { account_id: account.id, since_id: tracks[0], max_id: tracks[2] }

      expect(body_as_json.pluck(:id)).to match_array [tracks[1].id]
    end

    it 'returns ordered tracks with limit constraint' do
      tracks = 2.times.map do
        Fabricate(:music_attachment, status: Fabricate(:status, account: account))
      end

      get :index, params: { account_id: account.id, limit: 1 }

      expect(response).to have_http_status :success
      expect(body_as_json.pluck(:id)).to match_array [tracks[1].id]
    end

    it 'inserts pagination headers if necessary' do
      tracks = 3.times.map do
        Fabricate(:music_attachment, status: Fabricate(:status, account: account))
      end

      get :index, params: { account_id: account.id, max_id: tracks[2], limit: 1 }

      expect(response.headers['Link'].find_link(['rel', 'next']).href).to eq api_v1_account_tracks_url(limit: 1, max_id: tracks[1].id)
      expect(response.headers['Link'].find_link(['rel', 'prev']).href).to eq api_v1_account_tracks_url(limit: 1, since_id: tracks[1].id)
    end

    it 'returns http success' do
      get :index, params: { account_id: account.id }
      expect(response).to have_http_status :success
    end
  end
end
