# frozen_string_literal: true

module Admin
  class OauthAuthenticationsController < BaseController
    before_action :set_account
    before_action :set_oauth_authentication, only: [:destroy]

    def destroy
      begin
        ApplicationRecord.transaction do
          @account.user.initial_password_usage&.destroy!
          @oauth_authentication.destroy!
          flash[:notice] = t('oauth_authentications.successfully_unlinked')
        end
      rescue ActiveRecord::RecordInvalid
        flash[:alert] = t('oauth_authentications.failed_linking')
      end
      redirect_to admin_account_path(@account.id)
    end

    private

    def set_account
      @account = Account.find(params[:account_id])
    end

    def set_oauth_authentication
      @oauth_authentication = @account.oauth_authentications.find_by!(provider: 'pixiv')
    end
  end
end
