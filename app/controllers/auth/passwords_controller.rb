# frozen_string_literal: true

class Auth::PasswordsController < Devise::PasswordsController
  skip_before_action :require_no_authentication, only: [:edit, :update]

  layout 'auth'
end
