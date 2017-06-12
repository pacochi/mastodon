require 'rails_helper'

RSpec.describe QueueItem do
  describe '.create_from_link' do
    subject { described_class.create_from_link(url, account) }
    let(:account) { Fabricate(:account) }

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
            "short_url": "https://s.booth.pm/short.mp3",
            "long_url": "https://s.booth.pm/long.mp3",
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
      }
    end

    context 'given pawoo link' do
      let(:url) { Rails.application.routes.url_helpers.short_account_status_url(status.account, status) }
      let(:status) { Fabricate(:status, account: account) }

      context "when status hasn't attachments" do
        it { is_expected.to be_nil }
      end

      context "when status has image attachments" do
        let!(:media_attachment) { Fabricate(:media_attachment, status: status) }
        it { is_expected.to be_nil }
      end

      context "when status has video attachments" do
        let!(:media_attachment) { Fabricate(:media_attachment, status: status, type: 'video', music_info: music_info) }
        let(:music_info) { { title: 'title', artist: 'artist', duration: 1 } }

        it 'returns instance' do
          expect(subject.link).to eq(url)
          expect(subject.duration).to eq(music_info[:duration])
          expect(subject.source_type).to eq('pawoo-music')
          expect(subject.source_id).to eq(status.id.to_s)
          expect(subject.account_id).to eq(account.id)
          expect(subject.music_url).to be_nil
          expect(subject.info).to eq("#{music_info[:title]} - #{music_info[:artist]}")
          # expect(subject.video_url).to eq("#{music_info[:title]} - #{music_info[:artist]}")
        end

        # context 'status is unlisted' do
        #   let(:status) { Fabricate(:status, account: account, visibility: 'unlisted') }
        #   it { is_expected.to be_present }
        # end
        #
        # context 'status is direct' do
        #   let(:status) { Fabricate(:status, account: account, visibility: 'direct') }
        #   it { is_expected.to be_nil }
        # end
        #
        # context 'status is private' do
        #   let(:status) { Fabricate(:status, account: account, visibility: 'private') }
        #   it { is_expected.to be_nil }
        # end
      end
    end

    context 'given booth link' do
      before do
        stub_request(:get, 'https://api.booth.pm/pixiv/items/1').and_return(body: booth_api_response.to_json)
      end

      context 'invalid url' do
        let(:url) { 'https://booth.pm/ja/browse/1' }
        it { is_expected.to be_nil }
      end

      context 'market url' do
        let(:url) { 'https://booth.pm/ja/items/1' }
        it { is_expected.to be_present }
      end

      context 'shop url' do
        let(:url) { 'https://test.booth.pm/items/1' }
        it { is_expected.to be_present }
      end

      context 'localized url' do
        let(:url) { 'https://booth.pm/zh-tw/items/1' }
        it { is_expected.to be_present }
      end
    end

    context 'given apollo link' do
      let(:url) { 'https://booth.pm/apollo/a06/item?id=1' }

      before do
        stub_request(:get, 'https://api.booth.pm/pixiv/items/1').and_return(body: booth_api_response.to_json)
      end

      it { is_expected.to be_present }
    end

    context 'given youtube link' do
      let(:youtube_api_response) do
        {
          "kind": "youtube#videoListResponse",
          "pageInfo": {
            "totalResults": 1,
            "resultsPerPage": 1
          },
          "items": [
            {
              "id": "1",
              "kind": "youtube#video",
              "contentDetails": {
                "duration": "PT5M",
                "dimension": "2d",
                "definition": "hd",
                "caption": "false",
                "licensedContent": true,
                "regionRestriction": {
                  "blocked": []
                },
                "projection": "rectangular"
              }
            }
          ]
        }
      end

      let(:youtube_oembed_response) do
        {
          "height": 270,
          "author_name": "author_name",
          "thumbnail_url": "",
          "type": "video",
          "thumbnail_width": 480,
          "provider_url": "https:\/\/www.youtube.com\/",
          "version": "1.0",
          "thumbnail_height": 360,
          "author_url": "https:\/\/www.youtube.com\/user\/author_url",
          "title": "test",
          "width": 480,
          "provider_name": "YouTube"
        }
      end

      before do
        api_url = "https://www.googleapis.com/youtube/v3/videos?key=#{ENV['YOUTUBE_API_KEY']}&part=contentDetails&id=1"
        stub_request(:get, api_url).and_return(body: youtube_api_response.to_json)

        oembed_url = "https://www.youtube.com/oembed?url=#{url}"
        stub_request(:get, oembed_url).and_return(body: youtube_oembed_response.to_json)
      end

      context 'long youtube link' do
        let(:url) { 'https://www.youtube.com/watch?v=1' }
        it { is_expected.to be_present }
      end

      context 'short youtube link' do
        let(:url) { 'https://youtu.be/1' }
        it { is_expected.to be_present }
      end
    end
  end
end
