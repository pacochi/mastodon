require 'rails_helper'

RSpec.describe Intent::StatusesController, type: :controller do
  render_views

  describe 'GET #new' do
    before do
      sign_in(user)
      get :new
    end

    let(:user) { Fabricate(:user) }

    it 'renders intent' do
      expect(assigns(:appmode)).to eq 'intent'
      expect(response).to have_http_status(:success)
    end
  end
end
