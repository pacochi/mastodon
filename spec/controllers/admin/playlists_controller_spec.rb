require 'rails_helper'

describe Admin::PlaylistsController, type: :controller do
  render_views

  let!(:playlist) { Fabricate(:playlist, deck: 1) }
  before do
    sign_in Fabricate(:user, admin: true), scope: :user
  end

  describe 'GET #index' do
    it 'returns http success' do
      get :index

      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST #create' do
    subject do
      -> { post :create, params: { playlist: { deck: deck } } }
    end

    let(:deck) { 2 }

    it { is_expected.to change { Playlist.count }.by(1) }
    it 'redirects to admin playlists page' do
      subject.call
      expect(response).to redirect_to(admin_playlists_path)
    end

    context 'same deck number' do
      let(:deck) { playlist.deck }

      it { is_expected.not_to change { Playlist.count } }
      it 'is not permitted' do
        subject.call
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PATCH #update' do
    subject do
      -> { patch :update, params: { id: playlist.id, playlist: { deck: deck } } }
    end

    let(:deck) { 2 }

    it 'redirects to admin playlists page' do
      subject.call
      expect(response).to redirect_to(admin_playlists_path)
    end

    context 'same deck number' do
      let(:other_playlist) { Fabricate(:playlist, deck: 2) }
      let(:deck) { other_playlist.deck }

      it 'is not permitted' do
        subject.call
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE #destroy' do
    subject do
      -> { delete :destroy, params: { id: playlist.id } }
    end

    it { is_expected.to change { Playlist.count }.by(-1) }
    it 'redirects to admin playlists page' do
      subject.call
      expect(response).to redirect_to(admin_playlists_path)
    end
  end
end
