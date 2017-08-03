require 'rails_helper'

RSpec.describe HomeController, type: :controller do
  describe 'GET #index' do
    it 'renders default' do
      sign_in(Fabricate(:user))
      get :index

      expect(assigns(:appmode)).to eq 'default'
      expect(response).to have_http_status(:success)
    end
  end
end
