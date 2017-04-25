# frozen_string_literal: true

class Intent::StatusesController < ApplicationController
  before_action :authenticate_user!

  def new
    @body_classes = 'app-body'
    @token        = find_or_create_access_token.token
    @web_settings = Web::Setting.find_by(user: current_user)&.data || {}
    @admin        = Account.find_local(Setting.site_contact_username)
  end

  private

  # app/controllers/home_controller.rb にも同じコードがあるので、ここが更新された場合は気をつける
  def authenticate_user!
    redirect_to(single_user_mode? ? account_path(Account.first) : about_path) unless user_signed_in?
  end

  def find_or_create_access_token
    Doorkeeper::AccessToken.find_or_create_for(Doorkeeper::Application.where(superapp: true).first, current_user.id, 'read write follow', Doorkeeper.configuration.access_token_expires_in, Doorkeeper.configuration.refresh_token_enabled?)
  end
end
