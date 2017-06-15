require 'rails_helper'

RSpec.describe BoothUrl do
  describe '.extract_booth_item_id' do
    subject { described_class.extract_booth_item_id(text) }

    context 'given shop url' do
      let(:text) { 'hello https://test.booth.pm/items/1' }
      it { is_expected.to eq(1) }
    end

    context 'given apollo url' do
      let(:text) { 'hello https://booth.pm/apollo/a06/item?id=1' }
      it { is_expected.to eq(1) }
    end

    context 'given market url' do
      let(:text) { 'hello https://booth.pm/zh-tw/items/1' }
      it { is_expected.to eq(1) }
    end

    context 'given text' do
      let(:text) { 'hello' }
      it { is_expected.to be_nil }
    end
  end

  let(:instance) { described_class.new(uri) }

  describe '#to_img_music_pawoo_domain' do
    subject { instance.to_img_music_pawoo_domain }

    context 'given booth shop uri' do
      let(:uri) { 'https://booth.pm/ja/items/1' }

      it "doesn't change uri" do
        is_expected.to eq(uri)
      end
    end

    context 'given uri of short music' do
      let(:uri) { 'https://s.booth.pm/XXXXXXXX-1234-1234-1234-XXXXXXXXXXXX/s/1/short/XXXXXXXX-1234-1234-1234-XXXXXXXXXXXX.mp3' }

      it 'replace domain and path prefix' do
        is_expected.to start_with('https://img-music.pawoo.net/booth/')
      end
    end

    context 'given uri of long music' do
      let(:uri) { 'https://s.booth.pm/XXXXXXXX-1234-1234-1234-XXXXXXXXXXXX/s/1/full/XXXXXXXX-1234-1234-1234-XXXXXXXXXXXX.mp3' }

      it 'replace domain and path prefix' do
        is_expected.to start_with('https://img-music.pawoo.net/booth/')
      end
    end
  end
end
