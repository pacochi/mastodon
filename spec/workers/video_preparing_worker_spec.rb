# frozen_string_literal: true

require 'rails_helper'

describe VideoPreparingWorker do
  describe 'perform' do
    let(:track) { Fabricate(:track) }

    it 'prepares video' do
      skip 'skipped for environments without supported FFmpeg'

      VideoPreparingWorker.new.perform track.id

      track.reload
      expect(track.video).not_to eq nil
    end

    it 'notifies finish of preparation' do
      skip 'skipped for environments without supported FFmpeg'

      VideoPreparingWorker.new.perform track.id

      expect do
        Notification.find_by!(account: track.status.account, activity: track)
      end.not_to raise_error
    end

    it 'does not raise even if attachment is being removed in race condition' do
      expect do
        VideoPreparingWorker.new.perform 1
      end.not_to raise_error
    end
  end
end
