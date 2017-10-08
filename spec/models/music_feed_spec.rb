# frozen_string_literal: true

require 'rails_helper'

describe MusicFeed do
  describe '#get' do
    it 'gets statuses with ids in the range, maintining the order from Redis' do
      account = Fabricate(:account)
      Fabricate(:status, account: account, id: 1, music: Fabricate(:album))
      Fabricate(:status, account: account, id: 2, music: Fabricate(:album))
      Fabricate(:status, account: account, id: 3, music: Fabricate(:album))
      Fabricate(:status, account: account, id: 10, music: Fabricate(:album))
      Redis.current.zadd(FeedManager.instance.music_key(:home, account.id),
                        [[4, 'deleted'], [3, 'val3'], [2, 'val2'], [1, 'val1']])

      feed = MusicFeed.new(:home, account)
      results = feed.get(3)

      expect(results.map(&:id)).to eq [3, 2]
      expect(results.first.attributes.keys).to eq %w(id updated_at)
    end
  end
end
