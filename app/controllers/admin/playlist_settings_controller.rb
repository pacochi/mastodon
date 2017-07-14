# frozen_string_literal: true

module Admin
  class PlaylistSettingsController < BaseController
    PLAYLIST_SETTINGS = %w(
      max_queue_size
      max_add_count
      max_skip_count
      skip_limit_time
    ).freeze

    def update
      settings = Setting.where(var: 'playlist').first_or_initialize(var: 'playlist')
      value = Setting.playlist.merge(settings_params.map { |k, v| [k, v.to_i] }.to_h)
      if settings.update(value: value)
        flash[:notice] = 'Success!'
      else
        flash[:notice] = 'Failed!'
      end
      redirect_to admin_playlists_path
    end

    private

    def settings_params
      params.permit(PLAYLIST_SETTINGS)
    end
  end
end
