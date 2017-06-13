require 'rails_helper'

RSpec.describe Api::V1::BoothItemsController, type: :controller do
  describe 'GET #show' do
    before do
      Rails.cache.delete([described_class, id])
    end

    let(:id) { 1 }

    context 'given valid url' do
      let(:booth_api_response) do
        {
          "body": {
            "id": id,
            "name": "name",
          }
        }.to_json
      end

      before do
        stub_request(:get, 'https://api.booth.pm/pixiv/items/1').and_return(body: booth_api_response)
        get :show, params: { id: id }
      end

      it 'fetch and create cache' do
        expect(response).to have_http_status(:success)
        expect(response.body).to eq(booth_api_response)
      end
    end

    context 'given invalid url' do
      before do
        stub_request(:get, 'https://api.booth.pm/pixiv/items/1').and_return(status: 404, body: '')
        get :show, params: { id: id }
      end

      it { expect(response).to have_http_status(:not_found) }
    end
  end
end
