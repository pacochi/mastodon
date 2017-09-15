# frozen_string_literal: true

module TimelineConcern
  extend ActiveSupport::Concern

  private

  def set_initial_state_data
    @body_classes           = 'app-body'
    @token                  = current_session&.token
    @web_settings           = Web::Setting.find_by(user: current_user)&.data || {}
    @admin                  = Account.find_local(Setting.site_contact_username)
    @streaming_api_base_url = Rails.configuration.x.streaming_api_base_url
  end

  def authenticate_user!
    redirect_to(local_timeline_path) unless user_signed_in?
  end
end
