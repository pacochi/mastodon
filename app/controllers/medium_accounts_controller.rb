# frozen_string_literal: true

class MediumAccountsController < ApplicationController
  def index
    redirect_to short_account_media_path(username: params[:account_username], page: params[:page])
  end
end
