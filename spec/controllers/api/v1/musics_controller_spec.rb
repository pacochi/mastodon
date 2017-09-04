# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::MusicsController, type: :controller do
  let(:music) { fixture_file_upload('files/aint_we_got_fun_billy_jones1921.mp3') }
  let(:image) { fixture_file_upload('files/attachment.jpg') }
  let(:unknown) { fixture_file_upload('files/imports.txt') }

  context 'with write scope' do
    before do
      allow(controller).to receive(:doorkeeper_token) do
        Fabricate(:accessible_access_token, resource_owner_id: Fabricate(:user).id, scopes: 'write')
      end
    end

    it 'returns http unprocessable entity when a non-audio file is uploaded as a music' do
      post :create, params: { title: 'title', artist: Faker::Name.name, music: unknown, image: image }
      expect(response).to have_http_status :unprocessable_entity
    end

    it 'raises when a non-image file is uploaded as an album art' do
      post :create, params: { title: 'title', artist: Faker::Name.name, music: music, image: unknown }
      expect(response).to have_http_status :unprocessable_entity
    end

    it 'creates media attachment and music attachment' do
      skip 'skipped for environments without supported FFmpeg'

      post :create, params: { title: 'title', artist: 'artist', music: music, image: image }
      expect { MediaAttachment.joins(:music_attachment).find_by!(music_attachments: { title: 'title', artist: 'artist' }) }.not_to raise_error
    end

    it 'returns http success' do
      skip 'skipped for environments without supported FFmpeg'

      post :create, params: { title: 'title', artist: Faker::Name.name, music: music, image: image }
      expect(response).to have_http_status :success
    end
  end

  context 'without write scope' do
    it 'returns http unauthorized' do
      post :create, params: { title: 'title', artist: Faker::Name.name, music: music, image: image }
      expect(response).to have_http_status :unauthorized
    end
  end
end
