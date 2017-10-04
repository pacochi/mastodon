# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::TracksController, type: :controller do
  render_views

  let(:music) { fixture_file_upload('files/aint_we_got_fun_billy_jones1921.mp3') }
  let(:music_with_picture) { fixture_file_upload('files/aint_we_got_fun_billy_jones1921_with_picture.mp3') }
  let(:another_music) { fixture_file_upload('files/aprilshowers.mp3') }
  let(:image) { fixture_file_upload('files/attachment.jpg') }
  let(:video) { fixture_file_upload('files/aint_we_got_fun_billy_jones1921.mp4') }
  let(:unknown) { fixture_file_upload('files/imports.txt') }

  describe 'POST #create' do
    context 'with write scope' do
      before do
        stub_request(:head, %r{^http://test\.host/.*}).to_return status: 400
        allow(controller).to receive(:doorkeeper_token) do
          Fabricate(:accessible_access_token, resource_owner_id: user.id, scopes: 'write')
        end
      end

      let(:user) { Fabricate(:user) }

      it 'returns http unprocessable entity when a non-audio file is uploaded as a music' do
        post :create,
             params: { title: 'title', artist: Faker::Name.name, music: unknown }

        expect(response).to have_http_status :unprocessable_entity
      end

      it 'creates and renders status and track' do
        video_params = {
          blur: {
            movement: { band: { bottom: 50, top: 300 }, threshold: 165 },
            blink: { band: { bottom: 2000, top: 15000 }, threshold: 165 },
          },
          particle: {
            limit: { band: { bottom: 300, top: 2000 }, threshold: 165 },
            color: 0xff0000,
          },
          spectrum: {
            mode: 0,
            color: 0xff0000,
          },
        }

        post :create,
             params: { title: 'title', artist: 'artist', text: 'text', visibility: 'public', music: music, video: video_params }

        track = Track.find_by!(
          id: body_as_json[:id],
          account: user.account,
          status: body_as_json[:status][:id],
          title: 'title',
          artist: 'artist',
          text: 'text',
          duration: 177,
          video_blur_movement_band_bottom: 50,
          video_blur_movement_band_top: 300,
          video_blur_movement_threshold: 165,
          video_blur_blink_band_bottom: 2000,
          video_blur_blink_band_top: 15000,
          video_blur_blink_threshold: 165,
          video_particle_limit_band_bottom: 300,
          video_particle_limit_band_top: 2000,
          video_particle_limit_threshold: 165,
          video_particle_color: 0xff0000,
          video_spectrum_mode: 0,
          video_spectrum_color: 0xff0000,
        )

        expect(body_as_json[:title]).to eq 'title'
        expect(body_as_json[:artist]).to eq 'artist'
        expect(body_as_json[:text]).to eq 'text'
        expect(body_as_json[:status][:visibility]).to eq 'public'
        expect(body_as_json[:video]).to eq video_params
      end

      it 'joins given text and URL to create status text' do
        post :create,
             params: { title: 'title', artist: Faker::Name.name, text: 'text', visibility: 'public', music: music }

        track = Track.find_by!(title: 'title', text: 'text')
        expect(track.status.text).to eq 'text ' + short_account_track_url(user.account.username, track)
      end

      it 'uses URL as status text if the given text is blank' do
        post :create,
             params: { title: 'title', artist: Faker::Name.name, text: '', visibility: 'public', music: music }

        track = Track.find_by!(title: 'title', text: '')
        expect(track.status.text).to eq short_account_track_url(user.account.username, track)
      end

      it 'destroys track if it failed to create status' do
        expect do
          post :create, params: { title: 'title', artist: Faker::Name.name, text: Faker::Lorem.characters(501), music: music_with_picture }
        end.not_to change { Track.count }
      end

      it 'removes pictures in ID3v2 tag' do
        skip 'the output of ruby-mp3info messes up `file -b --mime`, used by Paperclip'

        post :create,
             params: { title: 'title', artist: Faker::Name.name, visibility: 'public', music: music_with_picture }

        tempfile = Tempfile.new
        begin
          Track.find(body_as_json[:id]).music.copy_to_local_file :original, tempfile.path
          expect(Mp3Info.open(tempfile.path) { |m| m.tag2.pictures }).to be_empty
        ensure
          tempfile.unlink
        end
      end

      it 'returns http success' do
        post :create,
             params: { title: 'title', artist: Faker::Name.name, visibility: 'public', music: music }

        expect(response).to have_http_status :success
      end
    end

    context 'without write scope' do
      it 'returns http unauthorized' do
        post :create,
             params: { title: 'title', artist: Faker::Name.name, visibility: 'public', music: music }

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

      it 'updates and renders music attributes' do
        track = Fabricate(:track, status: Fabricate(:status, account: user.account))

        video_params = {
          blur: {
            movement: { band: { bottom: 50, top: 300 }, threshold: 165 },
            blink: { band: { bottom: 2000, top: 15000 }, threshold: 165 },
          },
          particle: {
            limit: { band: { bottom: 300, top: 2000 }, threshold: 165 },
            color: 0xff0000,
          },
          spectrum: {
            mode: 0,
            color: 0xff0000,
          },
        }

        patch :update,
              params: { id: track.id, title: 'updated title', artist: 'updated artist', text: 'updated text', music: another_music, video: video_params }

        track.reload
        expect(track.title).to eq 'updated title'
        expect(track.artist).to eq 'updated artist'
        expect(track.text).to eq 'updated text'
        expect(track.duration).to eq 181
        expect(track.video_blur_movement_band_bottom).to eq 50
        expect(track.video_blur_movement_band_top).to eq 300
        expect(track.video_blur_movement_threshold).to eq 165
        expect(track.video_blur_blink_band_bottom).to eq 2000
        expect(track.video_blur_blink_band_top).to eq 15000
        expect(track.video_blur_blink_threshold).to eq 165
        expect(track.video_particle_limit_band_bottom).to eq 300
        expect(track.video_particle_limit_band_top).to eq 2000
        expect(track.video_particle_limit_threshold).to eq 165
        expect(track.video_particle_color).to eq 0xff0000
        expect(track.video_spectrum_mode).to eq 0
        expect(track.video_spectrum_color).to eq 0xff0000

        expect(body_as_json[:id]).to eq track.id
        expect(body_as_json[:title]).to eq 'updated title'
        expect(body_as_json[:artist]).to eq 'updated artist'
        expect(body_as_json[:text]).to eq 'updated text'
        expect(body_as_json[:video]).to eq video_params
      end

      it 'unsets video blur parameters if empty string is given' do
        track = Fabricate(
          :track,
          status: Fabricate(:status, account: user.account),
          video_blur_movement_band_bottom: 50,
          video_blur_movement_band_top: 300,
          video_blur_movement_threshold: 165,
          video_blur_blink_band_bottom: 2000,
          video_blur_blink_band_top: 15000,
          video_blur_blink_threshold: 165
        )

        patch :update, params: { id: track, video: { blur: '' } }

        track.reload
        expect(track.video_blur_movement_band_bottom).to eq 0
        expect(track.video_blur_movement_band_top).to eq 0
        expect(track.video_blur_movement_threshold).to eq 0
        expect(track.video_blur_blink_band_bottom).to eq 0
        expect(track.video_blur_blink_band_top).to eq 0
        expect(track.video_blur_blink_threshold).to eq 0
      end

      it 'does not change video blur parameters if nothing is given' do
        track = Fabricate(
          :track,
          status: Fabricate(:status, account: user.account),
          video_blur_movement_band_bottom: 50,
          video_blur_movement_band_top: 300,
          video_blur_movement_threshold: 165,
          video_blur_blink_band_bottom: 2000,
          video_blur_blink_band_top: 15000,
          video_blur_blink_threshold: 165
        )

        patch :update, params: { id: track }

        track.reload
        expect(track.video_blur_movement_band_bottom).to eq 50
        expect(track.video_blur_movement_band_top).to eq 300
        expect(track.video_blur_movement_threshold).to eq 165
        expect(track.video_blur_blink_band_bottom).to eq 2000
        expect(track.video_blur_blink_band_top).to eq 15000
        expect(track.video_blur_blink_threshold).to eq 165
      end

      it 'unsets video particle parameters if empty string is given' do
        track = Fabricate(
          :track,
          status: Fabricate(:status, account: user.account),
          video_particle_limit_band_bottom: 0,
          video_particle_limit_band_top: 0,
          video_particle_limit_threshold: 0,
          video_particle_color: nil
        )

        patch :update, params: { id: track, video: { particle: '' } }

        track.reload
        expect(track.video_particle_limit_band_bottom).to eq 0
        expect(track.video_particle_limit_band_top).to eq 0
        expect(track.video_particle_limit_threshold).to eq 0
        expect(track.video_particle_color).to eq nil
      end

      it 'does not change video particle parameters if nothing is given' do
        track = Fabricate(
          :track,
          status: Fabricate(:status, account: user.account),
          video_particle_limit_band_bottom: 300,
          video_particle_limit_band_top: 2000,
          video_particle_limit_threshold: 165,
          video_particle_color: 0xff0000
        )

        patch :update, params: { id: track }

        track.reload
        expect(track.video_particle_limit_band_bottom).to eq 300
        expect(track.video_particle_limit_band_top).to eq 2000
        expect(track.video_particle_limit_threshold).to eq 165
        expect(track.video_particle_color).to eq 0xff0000
      end

      it 'unsets video spectrum parameters if empty string is given' do
        track = Fabricate(
          :track,
          status: Fabricate(:status, account: user.account),
          video_spectrum_mode: 0,
          video_spectrum_color: 0xff0000
        )

        patch :update, params: { id: track, video: { spectrum: '' } }

        track.reload
        expect(track.video_spectrum_mode).to eq nil
        expect(track.video_spectrum_color).to eq nil
      end

      it 'does not change video particle parameters if nothing is given' do
        track = Fabricate(
          :track,
          status: Fabricate(:status, account: user.account),
          video_spectrum_mode: 0,
          video_spectrum_color: 0xff0000
        )

        patch :update, params: { id: track }

        track.reload
        expect(track.video_spectrum_mode).to eq 0
        expect(track.video_spectrum_color).to eq 0xff0000
      end

      it 'returns http success' do
        track = Fabricate(:track, status: Fabricate(:status, account: user.account))
        patch :update, params: { id: track.id }
        expect(response).to have_http_status :success
      end
    end

    context 'without write scope' do
      it 'returns http unauthorized' do
        track = Fabricate(:track)
        patch :update, params: { id: track.id }
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
      let(:track) { Fabricate(:track, status: Fabricate(:status, account: user.account)) }

      it 'deletes status and music attachment' do
        delete :destroy, params: { id: track.id }
        expect { track.status.reload }.to raise_error ActiveRecord::RecordNotFound
        expect { track.reload }.to raise_error ActiveRecord::RecordNotFound
      end

      it 'returns http success' do
        delete :destroy, params: { id: track.id }
        expect(response).to have_http_status :success
      end
    end

    context 'without write scope' do
      it 'returns http unauthorized' do
        track = Fabricate(:track)
        delete :destroy, params: { id: track.id }
        expect(response).to have_http_status :unauthorized
      end
    end
  end

  describe 'GET #show' do
    it 'renders attributes' do
      track = Fabricate(
        :track,
        title: 'title',
        artist: 'artist',
        text: 'text',
        duration: 1.minute,
        music: music,
        video: video,
        video_image: image,
        video_blur_movement_band_bottom: 50,
        video_blur_movement_band_top: 300,
        video_blur_movement_threshold: 165,
        video_blur_blink_band_bottom: 2000,
        video_blur_blink_band_top: 15000,
        video_blur_blink_threshold: 165,
        video_particle_limit_band_bottom: 300,
        video_particle_limit_band_top: 2000,
        video_particle_limit_threshold: 165,
        video_particle_color: 0xff0000,
        video_spectrum_mode: 0,
        video_spectrum_color: 0xff0000,
      )

      get :show, params: { id: track.id }

      expect(body_as_json[:title]).to eq 'title'
      expect(body_as_json[:artist]).to eq 'artist'
      expect(body_as_json[:text]).to eq 'text'

      expect(body_as_json[:video][:url]).to be_a String

      expect(body_as_json[:video][:blur]).to eq({
        movement: { band: { bottom: 50, top: 300 }, threshold: 165 },
        blink: { band: { bottom: 2000, top: 15000 }, threshold: 165 },
      })

      expect(body_as_json[:video][:particle]).to eq({
        limit: { band: { bottom: 300, top: 2000 }, threshold: 165 },
        color: 0xff0000,
      })

      expect(body_as_json[:video][:spectrum]).to eq({
        mode: 0,
        color: 0xff0000,
      })

      expect(body_as_json[:status][:id]).to eq track.status_id
    end

    it 'skips optional attributes of video if missing' do
      track = Fabricate(
        :track,
        video: nil,
        video_blur_movement_band_bottom: 0,
        video_blur_movement_band_top: 0,
        video_blur_movement_threshold: 0,
        video_blur_blink_band_bottom: 0,
        video_blur_blink_band_top: 0,
        video_blur_blink_threshold: 0,
        video_particle_limit_band_bottom: 0,
        video_particle_limit_band_top: 0,
        video_particle_limit_threshold: 0,
        video_particle_color: nil,
        video_spectrum_mode: nil,
        video_spectrum_color: nil,
      )

      get :show, params: { id: track.id }

      expect(body_as_json[:video]).not_to have_key :url
      expect(body_as_json[:video]).not_to have_key :blur
      expect(body_as_json[:video]).not_to have_key :particle
      expect(body_as_json[:video]).not_to have_key :spectrum
    end

    it 'returns http success' do
      track = Fabricate(:track)
      get :show, params: { id: track.id }
      expect(response).to have_http_status :success
    end
  end

  describe 'POST #prepare_video' do
    around { |example| Sidekiq::Testing.fake! &example }

    context 'with write scope' do
      before do
        allow(controller).to receive(:doorkeeper_token) do
          Fabricate(:accessible_access_token, resource_owner_id: user.id, scopes: 'write')
        end
      end

      let(:user) { Fabricate(:user) }
      let(:track) { Fabricate(:track, status: Fabricate(:status, account: user.account)) }

      it 'queues rendering' do
        post :prepare_video, params: { id: track }
        expect(VideoPreparingWorker).to have_enqueued_sidekiq_job track.id
      end

      it 'returns http success' do
        post :prepare_video, params: { id: track }
        expect(response).to have_http_status :success
      end
    end

    context 'without write scope' do
      it 'returns http unauthorized' do
        track = Fabricate(:track)
        delete :destroy, params: { id: track }
        expect(response).to have_http_status :unauthorized
      end
    end
  end
end
