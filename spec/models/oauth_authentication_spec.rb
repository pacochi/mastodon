require 'rails_helper'

RSpec.describe OauthAuthentication, type: :model do
  describe 'validations' do
    subject { Fabricate.build(:oauth_authentication) }

    it 'has a valid fabricator' do
      is_expected.to be_valid
    end

    it 'is invalid without uid' do
      is_expected.to be_valid
      subject.uid = nil
      is_expected.to model_have_error_on_field(:uid)
    end

    it 'is invalid without provider' do
      is_expected.to be_valid
      subject.provider = nil
      is_expected.to model_have_error_on_field(:provider)
    end

    context 'two factor authentication is enabled' do
      it 'is invalid' do
        is_expected.to be_valid
        subject.user.update!(otp_secret: User.generate_otp_secret(32), otp_required_for_login: true)
        is_expected.to be_invalid
        expect(subject.errors).to be_added(:base, :enabled_two_factor_authentication)
      end
    end
  end

  describe 'callbacks' do
    describe 'on before destroy' do
      subject { oauth_authentication.destroy }
      let!(:oauth_authentication) { Fabricate(:oauth_authentication) }

      context "user hasn't initial_password_usage" do
        it { is_expected.to be_truthy }
      end

      context "user has initial_password_usage" do
        before do
          oauth_authentication.user.create_initial_password_usage!
        end

        it { is_expected.to be_falsy }
      end
    end
  end
end
