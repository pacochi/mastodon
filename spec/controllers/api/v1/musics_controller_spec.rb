# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::MusicsController, type: :controller do
  render_views

  let(:music) { fixture_file_upload('files/aint_we_got_fun_billy_jones1921.mp3') }
  let(:music_with_picture) { fixture_file_upload('files/aint_we_got_fun_billy_jones1921_with_picture.mp3') }
  let(:image) { fixture_file_upload('files/attachment.jpg') }
  let(:unknown) { fixture_file_upload('files/imports.txt') }

  context 'POST #create' do
    context 'with write scope' do
      before do
        allow(controller).to receive(:doorkeeper_token) do
          Fabricate(:accessible_access_token, resource_owner_id: Fabricate(:user).id, scopes: 'write')
        end
      end

      it 'returns http unprocessable entity when a non-audio file is uploaded as a music' do
        post :create,
             params: { title: 'title', artist: Faker::Name.name, music: unknown, image: image }

        expect(response).to have_http_status :unprocessable_entity
      end

      it 'raises when a non-image file is uploaded as an album art' do
        post :create,
             params: { title: 'title', artist: Faker::Name.name, music: music, image: unknown }

        expect(response).to have_http_status :unprocessable_entity
      end

      it 'creates status and music attachment' do
        post :create,
             params: { title: 'title', artist: 'artist', music: music, image: image }

        music_attachment = MusicAttachment.find_by!(
          id: body_as_json[:id],
          title: 'title',
          artist: 'artist',
          duration: 177
        )

        expect(music_attachment.status.text).to eq music_url(music_attachment)
        expect(body_as_json[:title]).to eq 'title'
        expect(body_as_json[:artist]).to eq 'artist'
        expect(body_as_json[:status][:id]).to eq music_attachment.status_id
      end

      it 'does not render child nodes of video property if no parameters are specified' do
        post :create,
             params: { title: 'title', artist: Faker::Name.name, music: music, image: image }

        expect(body_as_json[:video]).to eq({})
      end

      it 'saves video parameters' do
        video = {
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
             params: { title: 'title', artist: Faker::Name.name, music: music, image: image, video: video }

        expect(body_as_json[:video]).to eq video
      end

      it 'removes pictures in ID3v2 tag' do
        skip 'the output of ruby-mp3info messes up `file -b --mime`, used by Paperclip'

        post :create,
             params: { title: 'title', artist: Faker::Name.name, music: music_with_picture, image: image }

        tempfile = Tempfile.new
        begin
          MusicAttachment.find(body_as_json[:id]).music.copy_to_local_file :original, tempfile.path
          expect(Mp3Info.open(tempfile.path) { |m| m.tag2.pictures }).to be_empty
        ensure
          tempfile.unlink
        end
      end

      it 'returns http success' do
        post :create,
             params: { title: 'title', artist: Faker::Name.name, music: music, image: image }

        expect(response).to have_http_status :success
      end
    end

    context 'without write scope' do
      it 'returns http unauthorized' do
        post :create,
             params: { title: 'title', artist: Faker::Name.name, music: music, image: image }

        expect(response).to have_http_status :unauthorized
      end
    end
  end

  context 'DELETE #destroy' do
    context 'with write scope' do
      before do
        allow(controller).to receive(:doorkeeper_token) do
          Fabricate(:accessible_access_token, resource_owner_id: Fabricate(:user).id, scopes: 'write')
        end
      end

      it 'deletes status and music attachment' do
        music_attachment = Fabricate(:music_attachment)
        delete :destroy, params: { id: music_attachment.id }
        expect { music_attachment.status.reload }.to raise_error ActiveRecord::RecordNotFound
        expect { music_attachment.reload }.to raise_error ActiveRecord::RecordNotFound
      end

      it 'returns http success' do
        music_attachment = Fabricate(:music_attachment)
        delete :destroy, params: { id: music_attachment.id }
        expect(response).to have_http_status :success
      end
    end

    context 'without write scope' do
      it 'returns http unauthorized' do
        music_attachment = Fabricate(:music_attachment)
        delete :destroy, params: { id: music_attachment.id }
        expect(response).to have_http_status :unauthorized
      end
    end
  end

  context 'GET #show' do
    it 'shows properties' do
      music_attachment = Fabricate(
        :music_attachment,
        title: 'title',
        artist: 'artist',
        duration: 1.minute,
        music: music,
        image: image,
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

      get :show, params: { id: music_attachment.id }

      expect(body_as_json[:title]).to eq 'title'
      expect(body_as_json[:artist]).to eq 'artist'

      expect(body_as_json[:video]).to eq({
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
      })

      expect(body_as_json[:status][:id]).to eq music_attachment.status.id
    end

    it 'skips optional properties of video if missing' do
      status = Fabricate(:status)

      music_attachment = Fabricate(
        :music_attachment,
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

      get :show, params: { id: music_attachment.id }

      expect(body_as_json[:status][:id]).to eq status.id
    end

    it 'returns http success' do
      music_attachment = Fabricate(:music_attachment)
      get :show, params: { id: music_attachment.id }
      expect(response).to have_http_status :success
    end
  end
end
