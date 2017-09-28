# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::AlbumsController, type: :controller do
  render_views

  let(:image) { fixture_file_upload('files/attachment.jpg') }

  describe 'POST #create' do
    context 'with write scope' do
      let(:user) { Fabricate(:user) }

      before do
        allow(controller).to receive(:doorkeeper_token) do
          Fabricate(:accessible_access_token, resource_owner_id: user.id, scopes: 'write')
        end
      end

      it 'creates and renders albums and status' do
        post :create,
             params: { title: 'title', description: 'description', image: image }

        album = Album.find_by!(
          id: body_as_json[:id],
          account: user.account,
          status: body_as_json[:status][:id],
          title: 'title',
          description: 'description',
        )

        expect(album.status.text).to eq short_account_album_url(user.account.username, album)
        expect(body_as_json[:title]).to eq 'title'
        expect(body_as_json[:description]).to eq 'description'
        expect(body_as_json[:status][:text]).to eq short_account_album_url(user.account.username, album)
      end

      it 'returns http success' do
        post :create,
             params: { title: 'title', description: 'description', image: image }

        expect(response).to have_http_status :success
      end
    end

    context 'without write scope' do
      it 'returns http unauthorized' do
        post :create,
             params: { title: 'title', description: 'description', image: image }

        expect(response).to have_http_status :unauthorized
      end
    end
  end

  describe 'PATCH #update' do
    context 'with write scope' do
      before do
        allow(controller).to receive(:doorkeeper_token) do
          Fabricate(:accessible_access_token, resource_owner_id: user.id, scopes: 'write')
        end
      end

      let(:user) { Fabricate(:user) }
      let(:album) { Fabricate(:album, status: Fabricate(:status, account: user.account)) }

      it 'updates and renders albums' do
        patch :update,
              params: { id: album.id, title: 'updated title', description: 'updated description' }

        album.reload
        expect(album.title).to eq 'updated title'
        expect(album.description).to eq 'updated description'
        expect(body_as_json[:id]).to eq album.id
        expect(body_as_json[:title]).to eq 'updated title'
        expect(body_as_json[:description]).to eq 'updated description'
      end

      it 'returns http success' do
        patch :update, params: { id: album.id }
        expect(response).to have_http_status :success
      end
    end

    context 'without write scope' do
      it 'returns http unauthorized' do
        album = Fabricate(:album)
        patch :update, params: { id: album.id }
        expect(response).to have_http_status :unauthorized
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'with write scope' do
      before do
        allow(controller).to receive(:doorkeeper_token) do
          Fabricate(:accessible_access_token, resource_owner_id: user.id, scopes: 'write')
        end
      end

      let(:user) { Fabricate(:user) }
      let(:album) { Fabricate(:album, status: Fabricate(:status, account: user.account)) }

      it 'destroys albums' do
        delete :destroy, params: { id: album.id }
        expect { album.reload }.to raise_error ActiveRecord::RecordNotFound
      end

      it 'returns http success' do
        delete :destroy, params: { id: album.id }
        expect(response).to have_http_status :success
      end
    end

    context 'without write scope' do
      it 'returns http unauthorized' do
        album = Fabricate(:album)
        delete :destroy, params: { id: album.id }
        expect(response).to have_http_status :unauthorized
      end
    end
  end

  describe 'GET #show' do
    it 'renders albums' do
      album = Fabricate(
        :album,
        title: 'title',
        description: 'description',
        image: image,
      )

      get :show, params: { id: album.id }

      expect(body_as_json[:id]).to eq album.id
      expect(body_as_json[:title]).to eq 'title'
      expect(body_as_json[:description]).to eq 'description'
      expect(body_as_json[:status][:id]).to eq album.status_id
    end

    it 'returns http success' do
      album = Fabricate(:album)
      get :show, params: { id: album.id }
      expect(response).to have_http_status :success
    end
  end
end
