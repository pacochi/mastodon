# frozen_string_literal: true

class FollowingAccountsController < ApplicationController
  include AccountControllerConcern

  BOT_ACCOUNT_IDS = [112251].freeze

  def index
    @accounts = @account.following.page(params[:page]).per(FOLLOW_PER_PAGE)
  end

  private

  def set_account
    @account = Account.where.not(id: BOT_ACCOUNT_IDS).find_local!(params[:account_username])
  end
end
