# frozen_string_literal: true

module Admin
  class AccountsController < BaseController
    before_action :set_account, only: [:show, :subscribe, :unsubscribe, :redownload]
    before_action :require_remote_account!, only: [:subscribe, :unsubscribe, :redownload]

    def index
      @accounts = filtered_accounts.page(params[:page])
    end

<<<<<<< HEAD
    def show
      @account = Account.find(params[:id])
      @oauth_authentication = @account.oauth_authentications.find_by(provider: :pixiv)
=======
    def show; end

    def subscribe
      Pubsubhubbub::SubscribeWorker.perform_async(@account.id)
      redirect_to admin_account_path(@account.id)
    end

    def unsubscribe
      UnsubscribeService.new.call(@account)
      redirect_to admin_account_path(@account.id)
    end

    def redownload
      @account.avatar = @account.avatar_remote_url
      @account.header = @account.header_remote_url
      @account.save!

      redirect_to admin_account_path(@account.id)
>>>>>>> 947887f261f74f84312327a5265553e8f16655fe
    end

    private

    def set_account
      @account = Account.find(params[:id])
    end

    def require_remote_account!
      redirect_to admin_account_path(@account.id) if @account.local?
    end

    def filtered_accounts
      AccountFilter.new(filter_params).results
    end

    def filter_params
      params.permit(
        :local,
        :remote,
        :by_domain,
        :silenced,
        :recent,
        :suspended,
        :username,
        :display_name,
        :email,
        :ip
      )
    end
  end
end
