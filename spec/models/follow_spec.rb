require 'rails_helper'

RSpec.describe Follow, type: :model do
  let(:alice) { Fabricate(:account, username: 'alice') }
  let(:bob)   { Fabricate(:account, username: 'bob') }

  subject { Follow.new(account: alice, target_account: bob) }

  describe 'validations' do
    it 'has a valid fabricator' do
      follow = Fabricate.build(:follow)
      expect(follow).to be_valid
    end

    it 'is invalid without an account' do
      follow = Fabricate.build(:follow, account: nil)
      follow.valid?
      expect(follow).to model_have_error_on_field(:account)
    end

    it 'is invalid without a target_account' do
      follow = Fabricate.build(:follow, target_account: nil)
      follow.valid?
      expect(follow).to model_have_error_on_field(:target_account)
    end
  end

  describe 'callbacks' do
    let!(:account) { Fabricate(:account) }
    let!(:target_account) { Fabricate(:account) }

    describe 'followers_count' do
      context 'on create' do
        subject do
          -> { Fabricate(:follow, account: account, target_account: target_account) }
        end

        it 'updates followers_count' do
          is_expected.to change {
            [
              account.following_count,
              account.followers_count,
              target_account.following_count,
              target_account.followers_count
            ]
          }.from([0, 0, 0, 0]).to([1, 0, 0, 1])
        end
      end

      context 'on destroy' do
        subject do
          -> { follow.destroy! }
        end

        let!(:follow) { Fabricate(:follow, account: account, target_account: target_account) }

        it 'updates followers_count' do
          is_expected.to change {
            [
              account.following_count,
              account.followers_count,
              target_account.following_count,
              target_account.followers_count
            ]
          }.from([1, 0, 0, 1]).to([0, 0, 0, 0])
        end

        context 'on multiple destroy' do
          subject do
            -> { Follow.where(id: [follow_1.id, follow_2.id, follow_3.id]).destroy_all }
          end

          let!(:follow_1) { follow }
          let!(:follow_2) { Fabricate(:follow, account: account) }
          let!(:follow_3) { Fabricate(:follow, target_account: target_account) }

          it 'updates followers_count' do
            is_expected.to change {
              [
                account.reload.following_count,
                account.reload.followers_count,
                target_account.reload.following_count,
                target_account.reload.followers_count
              ]
            }.from([2, 0, 0, 2]).to([0, 0, 0, 0])
          end
        end
      end
    end
  end
end
