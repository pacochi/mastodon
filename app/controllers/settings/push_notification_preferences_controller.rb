# frozen_string_literal: true

class Settings::PushNotificationPreferencesController < ApplicationController
  layout 'admin'

  before_action :authenticate_user!

  def show; end

  def update
    user_settings.update(user_settings_params.to_h)

    if current_user.save
      redirect_to settings_push_notification_preferences_path, notice: I18n.t('generic.changes_saved_msg')
    else
      render :show, status: :unprocessable_entity
    end
  end

  private

  def user_settings
    UserSettingsDecorator.new(current_user)
  end

  def user_settings_params
    params.require(:user).permit(
      notification_firebase_cloud_messagings: %i(follow follow_request reblog favourite mention),
      interactions: %i(must_be_follower must_be_following)
    )
  end
end
