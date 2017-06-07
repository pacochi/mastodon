require 'rails_helper'

RSpec.describe PinnedStatus, type: :model do
  describe 'validations' do
    subject { Fabricate.build(:pinned_status) }

    it 'has a valid fabricator' do
      is_expected.to be_valid
    end

    it 'is invalid without account' do
      subject.account = nil
      is_expected.to model_have_error_on_field(:account)
    end

    it 'is invalid without status' do
      subject.status = nil
      is_expected.to model_have_error_on_field(:status)
    end

    it 'is invalid if status is conflicted' do
      subject.save!
      dupped = subject.dup

      expect(dupped).to be_invalid.and model_have_error_on_field(:account)
    end

    it "is invalid with other's status" do
      subject.account = Fabricate(:account)
      expect(subject).to be_invalid
      expect(subject.errors).to be_added(:status, :no_permission)
    end

    it 'is invalid with private status' do
      subject.status.visibility = 'private'

      expect(subject).to be_invalid
      expect(subject.errors).to be_added(:status, :private)
    end
  end

  describe 'scopes' do
    describe '.recent' do
      subject { described_class.recent }

      let!(:id_1) { Fabricate(:pinned_status, id: 1) }
      let!(:id_3) { Fabricate(:pinned_status, id: 3) }
      let!(:id_2) { Fabricate(:pinned_status, id: 2) }

      it { is_expected.to eq([id_3, id_2, id_1]) }
    end
  end
end
