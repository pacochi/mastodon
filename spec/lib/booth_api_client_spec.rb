require 'rails_helper'

RSpec.describe BoothApiClient do
  describe '#item' do
    subject { described_class.new.item(id) }

    let(:id) { 1 }

    context 'given item id' do
      let(:booth_api_response) do
        {
          "body": {
            "id": 1,
            "name": "name",
            "url": "https://test.booth.pm/items/1",
            "primary_image": {},
            "variation_types": ["digital", "via_warehouse"],
            "published_at": 1,
            "price": 100,
            "price_str": "400 JPY~",
            "description": "description",
            "adult": false,
            "market_url": "https://booth.pm/zh-tw/items/1",
            "sound": {
              "short_url": "https://s.booth.pm/XXXXXXXX-1234-1234-1234-XXXXXXXXXXXX/s/1/short/XXXXXXXX-1234-1234-1234-XXXXXXXXXXXX.mp3",
              "long_url": "https://s.booth.pm/XXXXXXXX-1234-1234-1234-XXXXXXXXXXXX/s/1/full/XXXXXXXX-1234-1234-1234-XXXXXXXXXXXX.mp3",
              "duration": 91
            },
            "shop": {
              "name": "shop_name",
              "description": "description",
              "websites": [],
              "subdomain": "test",
              "url": "https://test.booth.pm/",
              "user": {
                "nickname": "nickname",
                "icon_image": {},
                "pixiv_user_id": nil
              }
            },
          }
        }.to_json
      end

      before do
        stub_request(:get, 'https://api.booth.pm/pixiv/items/1').and_return(body: booth_api_response)
      end

      it 'fetch from booth' do
        status, body = subject
        expect(status).to eq(200)
        expect(body).to be_present
      end

      it 'replace hostname with img-music' do
        _, body = subject

        expect(body.dig('body', 'sound', 'short_url')).to start_with('https://img-music.pawoo.net/booth')
        expect(body.dig('body', 'sound', 'long_url')).to start_with('https://img-music.pawoo.net/booth')
      end
    end

    context 'given not found id' do
      before do
        stub_request(:get, 'https://api.booth.pm/pixiv/items/1').and_return(status: 404, body: not_found.to_json)
      end

      let(:not_found) do
        { 'status': 404, 'error': 'Not Found' }
      end

      it { is_expected.to eq([404, not_found.as_json]) }
    end
  end
end
