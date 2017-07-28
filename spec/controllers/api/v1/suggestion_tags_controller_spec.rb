require 'rails_helper'

RSpec.describe Api::V1::SuggestionTagsController, type: :controller do
  render_views

  let!(:suggestion_tag)  { Fabricate(:suggestion_tag, tag: Fabricate(:tag, name: 'suggestion')) }

  describe 'GET #index' do
    it 'returns http success' do
      get :index, params: { limit: 1, type: 'normal' }

      expect(response).to have_http_status(:success)
    end
  end
end
