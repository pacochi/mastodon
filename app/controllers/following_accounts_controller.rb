# frozen_string_literal: true

class FollowingAccountsController < ApplicationController
  include AccountControllerConcern

  BOT_ACCOUNT_IDS = [134316, 109687, 6655, 135511, 151546, 8595, 320, 112251, 135602, 47592, 50776, 128145, 134831, 135026, 16896, 109545, 131540, 189622, 189263, 4273, 73311, 65541, 200022, 134823, 163458, 145150, 51908, 20205, 86842, 7647, 168346, 134617, 51010, 2455, 131396, 134553].freeze

  def index
    @accounts = @account.following.page(params[:page]).per(FOLLOW_PER_PAGE)
  end

  private

  def set_account
    @account = Account.where.not(id: BOT_ACCOUNT_IDS).find_local!(params[:account_username])
  end
end
