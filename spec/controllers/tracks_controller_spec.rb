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
      expect(response).to redirect_to 'http://test.host/timelines/public/local'
    end
  end

  describe 'GET #edit' do
    let(:user) { Fabricate(:user) }
    let(:account) {  Fabricate(:account, user: user)}

    subject do
      -> { get :edit, params: { id: status.id } }
    end

    context 'when signed in' do
      before do
        sign_in(user)
      end

      context 'with own track' do
        let (:status) { Fabricate(:status, music: Fabricate(:track), music_type: 'Track', account: account) }

        it 'returns http success' do
          subject.call
          expect(response).to have_http_status :success
        end
      end

      context 'with others track' do
        let (:status) { Fabricate(:status, music: Fabricate(:track), music_type: 'Track', account: Fabricate(:account)) }

        it 'returns http not found' do
          subject.call
          expect(response).to have_http_status :not_found
        end
      end

      context 'with no tracks' do
        let (:status) { Fabricate(:status, account: Fabricate(:account)) }

        it 'returns http not found' do
          subject.call
          expect(response).to have_http_status :not_found
        end
      end
    end

    context 'when signed out' do
      context 'with own track' do
        let (:status) { Fabricate(:status, music: Fabricate(:track), music_type: 'Track', account: account) }

        it 'redirects' do
          subject.call
          expect(response).to redirect_to 'http://test.host/timelines/public/local'
        end
      end
    end
  end
end
