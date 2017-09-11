# frozen_string_literal: true

require 'rails_helper'

describe VideoPreparingWorker do
  describe 'perform' do
    let(:music_attachment) { Fabricate(:music_attachment) }

    it 'prepares video'

    it 'notifies finish of preparation' do
      VideoPreparingWorker.new.perform music_attachment.id

      expect do
        Notification.find_by!(account: music_attachment.status.account, activity: music_attachment)
      end.not_to raise_error
    end

    it 'does not raise even if attachment is being removed in race condition' do
      expect do
        VideoPreparingWorker.new.perform 1
      end.not_to raise_error
    end
  end
end
