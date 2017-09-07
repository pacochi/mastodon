# frozen_string_literal: true

require 'rails_helper'

describe DefaultFollowWorker do
  subject { described_class.new }

  describe 'perform' do
    it 'calls the follow service' do
      account = Fabricate(:account)
      DefaultFollowWorker::DEFAULT_FOLLOW_USERS.each do |username|
        Fabricate(:account, username: username)
      end

      follow_service = double(call: nil)
      allow(FollowService).to receive(:new).and_return(follow_service)

      subject.perform(account.id)
      expect(follow_service).to have_received(:call).twice
    end
  end
end
