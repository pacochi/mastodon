# frozen_string_literal: true

class Auth::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  include WithRedisSessionStore
  include Localized

  def pixiv
    data = request.env['omniauth.auth']

    if signed_in?(:user)
      oauth_authentication = current_user.oauth_authentications.find_or_initialize_by(
        provider: data[:provider],
        uid: data[:uid]
      )

      if oauth_authentication.save
        flash[:notice] = t('oauth_authentications.successfully_linked')
      else
        flash[:alert] = oauth_authentication.errors.full_messages.first
      end

      redirect_to settings_oauth_authentications_path
    else
      oauth_authentication = OauthAuthentication.find_by(provider: data.provider, uid: data.uid)

      if oauth_authentication
        user = oauth_authentication.user
        if user.otp_required_for_login?
          session[:otp_user_id] = user.id
          self.resource = user
          render 'auth/sessions/two_factor', layout: 'auth'
        else
          sign_in(oauth_authentication.user)
          redirect_to root_path
        end
      else
        store_omniauth_auth
        redirect_to new_user_oauth_registration_path
      end
    end
  end

  private

  def store_omniauth_auth
    redis_session_store('devise.omniauth') do |redis|
      redis.setex('auth', 15.minutes, request.env['omniauth.auth'].to_json)
    end
  end
end
