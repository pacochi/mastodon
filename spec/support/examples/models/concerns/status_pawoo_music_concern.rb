# frozen_string_literal: true

shared_examples 'StatusPawooMusicConcern' do
  describe '.next_id' do
    it 'returns next id' do
      expect { Fabricate(:status, Status.next_id) }.not_to raise_error
    end
  end
end
