require 'rails_helper'

RSpec.describe PixivFollow, type: :model do
  describe 'validations' do
    subject(:instance) { Fabricate.build(:pixiv_follow) }

    it 'is invalid without a oauth_authentication_id' do
      instance.oauth_authentication = nil
      is_expected.to be_invalid
      is_expected.to model_have_error_on_field(:oauth_authentication, :required)
    end

    it 'is invalid without a target_pixiv_uid' do
      instance.target_pixiv_uid = nil
      is_expected.to be_invalid
      is_expected.to model_have_error_on_field(:target_pixiv_uid, :blank)
    end
  end
end
