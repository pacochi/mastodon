require 'rails_helper'

RSpec.describe Api::V1::PinnedStatusesController, type: :controller do
  render_views

  let(:user)  { Fabricate(:user, account: account) }
  let(:account) { Fabricate(:account) }
  let(:token) { double acceptable?: true, resource_owner_id: user.id }
  let(:status) { Fabricate(:status, account: account) }

  before do
    allow(controller).to receive(:doorkeeper_token) { token }
  end

  describe 'POST #create' do
    subject do
      -> { post :create, params: { status_id: status.id } }
    end

    it { expect(response).to have_http_status(:success) }

    it 'creates pinned_status' do
      is_expected.to change(PinnedStatus, :count).from(0).to(1)
    end

    context 'status is already pinned' do
      let!(:pinned_status) { Fabricate(:pinned_status, status: status, account: account) }

      it "doesn't create pinned_status" do
        is_expected.to_not change(PinnedStatus, :count).from(1)
      end
    end
  end

  describe 'DELETE #destroy' do
    subject do
      -> { delete :destroy, params: { status_id: status.id } }
    end

    let!(:pinned_status) { Fabricate(:pinned_status, account: account, status: status) }

    it 'destroys pinned_status' do
      is_expected.to change(PinnedStatus, :count).from(1).to(0)
    end
  end
end
