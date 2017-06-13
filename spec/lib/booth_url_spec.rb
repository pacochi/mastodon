require 'rails_helper'

RSpec.describe BoothUrl do
  let(:instance) { described_class.new(uri) }

  describe '#to_img_pawoo_music_domain' do
    subject { instance.to_img_pawoo_music_domain }

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
