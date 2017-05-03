require 'rails_helper'

RSpec.describe Favourite, type: :model do
  let(:alice)  { Fabricate(:account, username: 'alice') }
  let(:bob)    { Fabricate(:account, username: 'bob') }
  let(:status) { Fabricate(:status, account: bob) }

  subject { Favourite.new(account: alice, status: status) }

  describe 'callbacks' do
    describe 'favourites_count' do
      let!(:status) { Fabricate(:status) }

      context 'on create' do
        subject do
          -> { Fabricate(:favourite, status: status) }
        end

        it 'updates favourites_count' do
          is_expected.to change {
            status.favourites_count
          }.from(0).to(1)
        end
      end

      context 'on destroy' do
        subject do
          -> { favourite.destroy! }
        end

        let!(:favourite) { Fabricate(:favourite, status: status) }

        it 'updates favourites_count' do
          is_expected.to change {
            status.favourites_count
          }.from(1).to(0)
        end

        context 'on multiple destroy' do
          subject do
            -> { Favourite.where(id: [favourite_1.id, favourite_2.id]).destroy_all }
          end

          let!(:favourite_1) { favourite }
          let!(:favourite_2) { Fabricate(:favourite, status: status) }

          it 'updates favourites_count' do
            is_expected.to change {
              status.reload.favourites_count
            }.from(2).to(0)
          end
        end
      end
    end
  end
end
