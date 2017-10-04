# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::Albums::TracksController, type: :controller do
  let(:user) { Fabricate(:user) }
  let(:album) { Fabricate(:album, status: Fabricate(:status, account: user.account)) }
  let(:track) { Fabricate(:track) }

  describe 'PUT #update' do
    context 'with write scope' do
      before do
        allow(controller).to receive(:doorkeeper_token) do
          Fabricate(:accessible_access_token, resource_owner_id: user.id, scopes: 'write')
        end
      end

      context 'when parameter relative_to is present' do
        let(:relative_to) { Fabricate(:album_track, album: album, position: '0.2') }

        context 'when above parameter is false' do
          subject { put :update, params: { album_id: album, id: track, relative_to: relative_to.track_id } }

          it 'sets the position below relative_to and above the succeeding track if present' do
            Fabricate(:album_track, album: album, position: '0.3')

            subject

            subject_model = AlbumTrack.find_by!(album: album, track: track)
            expect(subject_model.position).to be_between(BigDecimal('0.2'), BigDecimal('0.3')).exclusive
          end

          it 'sets the position below relative_to and above the maximum if there is no suceeding track' do
            subject

            subject_model = AlbumTrack.find_by!(album: album, track: track)
            expect(subject_model.position).to be_between(BigDecimal('0.2'), AlbumTrack::MAX_POSITION).exclusive
          end
        end

        context 'when above parameter is true' do
          subject { put :update, params: { album_id: album, id: track, relative_to: relative_to.track_id, above: true } }

          it 'sets the position above relative_to and below the proceeding track if present' do
            Fabricate(:album_track, album: album, position: '0.1')

            subject

            subject_model = AlbumTrack.find_by!(album: album, track: track)
            expect(subject_model.position).to be_between(BigDecimal('0.1'), BigDecimal('0.2')).exclusive
          end

          it 'sets the position above relative_to and below the minimum if there is no proceeding track' do
            subject

            subject_model = AlbumTrack.find_by!(album: album, track: track)
            expect(subject_model.position).to be_between(AlbumTrack::MIN_POSITION, BigDecimal('0.2')).exclusive
          end
        end
      end

      context 'when parameter relative_to is not present' do
        it 'sets the position below the last track if present and above parameter is false' do
          Fabricate(:album_track, album: album, position: '0.5')

          put :update, params: { album_id: album, id: track }

          subject_model = AlbumTrack.find_by!(album: album, track: track)
          expect(subject_model.position).to be_between(BigDecimal('0.5'), AlbumTrack::MAX_POSITION).exclusive
        end

        it 'sets the position below the last track if present and above parameter is true' do
          Fabricate(:album_track, album: album, position: '0.5')

          put :update, params: { album_id: album, id: track, above: true }

          subject_model = AlbumTrack.find_by!(album: album, track: track)
          expect(subject_model.position).to be_between( AlbumTrack::MIN_POSITION, BigDecimal('0.5')).exclusive
        end

        it 'sets the middle position if there is no track' do
          put :update, params: { album_id: album, id: track }

          subject_model = AlbumTrack.find_by!(album: album, track: track)
          expect(subject_model.position).to be_between(AlbumTrack::MIN_POSITION, AlbumTrack::MAX_POSITION).exclusive
        end
      end

      it 'returns http success' do
        put :update, params: { album_id: album, id: track }
        expect(response).to have_http_status :success
      end
    end

    context 'without write scope' do
      it 'returns http unauthorized' do
        put :update, params: { album_id: album, id: track }
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

      let!(:album_track) do
        Fabricate(:album_track, album: album, track: track, position: '0.3')
      end

      it 'updates album tracks' do
        origin = Fabricate(:album_track, album: album, position: '0.4')

        patch :update, params: { album_id: album.id, id: track.id, prev_id: origin.track_id }

        album_track.reload
        expect(album_track.position).to be > BigDecimal('0.4')
      end

      it 'returns http success' do
        origin = Fabricate(:album_track, album: album, position: '0.4')

        patch :update, params: { album_id: album.id, id: track.id, prev_id: origin.track_id }

        expect(response).to have_http_status :success
      end
    end

    context 'without write scope' do
      it 'returns http unauthorized' do
        origin = Fabricate(:album_track, album: album, position: '0.4')

        patch :update, params: { album_id: album.id, id: track.id, prev_id: origin.track_id }

        expect(response).to have_http_status :unauthorized
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:album_track) do
      Fabricate(:album_track, album: album, track: track, position: '0.1')
    end

    context 'with write scope' do
      before do
        allow(controller).to receive(:doorkeeper_token) do
          Fabricate(:accessible_access_token, resource_owner_id: user.id, scopes: 'write')
        end
      end

      it 'destroys album tracks' do
        delete :destroy, params: { album_id: album, id: track }
        expect { album_track.reload }.to raise_error ActiveRecord::RecordNotFound
      end

      it 'returns http success' do
        delete :destroy, params: { album_id: album, id: track }
        expect(response).to have_http_status :success
      end
    end

    context 'without write scope' do
      it 'returns http unauthorized' do
        delete :destroy, params: { album_id: album, id: track }
        expect(response).to have_http_status :unauthorized
      end
    end
  end

  describe 'GET #index' do
    render_views

    it 'renders tracks ordered by position column with id constraints' do
      album_tracks = [
        Fabricate(:album_track, album: album, position: '0.3'),
        Fabricate(:album_track, album: album, position: '0.2'),
        Fabricate(:album_track, album: album, position: '0.1'),
      ]

      get :index, params: { album_id: album, since_id: album_tracks[2].track_id, max_id: album_tracks[0].track_id }

      expect(body_as_json.pluck(:id)).to match_array [album_tracks[1].track_id]
    end

    it 'renders tracks ordered by position column with limit constraint' do
      album_tracks = [
        Fabricate(:album_track, album: album, position: '0.2'),
        Fabricate(:album_track, album: album, position: '0.1'),
      ]

      get :index, params: { album_id: album, limit: 1 }

      expect(body_as_json.pluck(:id)).to match_array [album_tracks[1].track_id]
    end

    it 'set pagination headers if necessary' do
      album_tracks = [
        Fabricate(:album_track, album: album, position: '0.3'),
        Fabricate(:album_track, album: album, position: '0.2'),
        Fabricate(:album_track, album: album, position: '0.1'),
      ]

      get :index, params: { album_id: album, since_id: album_tracks[2].track_id, limit: 1 }

      expect(response.headers['Link'].find_link(['rel', 'next']).href).to eq api_v1_album_tracks_url(limit: 1, since_id: album_tracks[1].track_id)
      expect(response.headers['Link'].find_link(['rel', 'prev']).href).to eq api_v1_album_tracks_url(limit: 1, max_id: album_tracks[1].track_id)
    end

    it 'returns http unprocessable_entity if ranging parameters are unprocessable' do
      get :index, params: { album_id: album, since_id: 1, max_id: 2 }
      expect(response).to have_http_status :unprocessable_entity
    end

    it 'returns http success' do
      get :index, params: { album_id: album }
      expect(response).to have_http_status :success
    end
  end
end
