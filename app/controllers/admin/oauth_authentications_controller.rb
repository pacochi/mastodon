# frozen_string_literal: true

module Admin
  class OauthAuthenticationsController < BaseController
    before_action :set_account

    def destroy
      oauth_authentication = @account.oauth_authentications.find_by!(provider: 'pixiv')
      if oauth_authentication.force_destroy
        flash[:notice] = t('oauth_authentications.successfully_unlinked')
      else
        flash[:alert] = t('oauth_authentications.failed_linking')
      end
      redirect_to admin_account_path(@account.id)
    end

    private

    def set_account
      @account = Account.find(params[:account_id])
    end
  end
end
