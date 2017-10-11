# frozen_string_literal: true

class Api::V1::TracksController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write }, except: :show
  before_action :require_user!, except: :show

  respond_to :json

  def create
    params.require [:title, :artist, :music]

    track = Track.create!(track_attributes)

    begin
      status_id = Status.next_id
      status_text = short_account_status_url(current_account.username, status_id)
      unless status_params[:text].blank?
        status_text = [status_params[:text], status_text].join(' ')
      end

      @status = PostStatusService.new.call(
        current_account,
        status_text,
        nil,
        id: status_id,
        music: track,
        visibility: status_params[:visibility],
        application: doorkeeper_token.application
      )
    rescue
      track.destroy!
      raise
    end

    render 'api/v1/statuses/show'
  end

  def update
    @status = Status.find_by!(id: params.require(:id), account: current_account, music_type: 'Track')
    @status.music.update! track_attributes

    render 'api/v1/statuses/show'
  end

  def prepare_video
    @status = Status.find_by!(id: params.require(:id), account: current_account, music_type: 'Track')
    VideoPreparingWorker.perform_async @status.id

    render_empty
  end

  private

  def track_attributes
    return @track_attributes if @track_attributes

    attributes = track_params.dup

    if track_params[:music].present?
      attributes.merge! duration: music_duration.ceil
    end

    case params.dig('video', 'image')
    when nil
    when ''
      attributes.merge!(video_image: nil)
    else
      attributes.merge!(video_image: params.dig('video', 'image'))
    end

    case params.dig('video', 'blur')
    when nil
    when ''
      attributes.merge!(
        video_blur_movement_band_bottom: 0,
        video_blur_movement_band_top: 0,
        video_blur_movement_threshold: 0,
        video_blur_blink_band_bottom: 0,
        video_blur_blink_band_top: 0,
        video_blur_blink_threshold: 0
      )
    else
      attributes.merge!(
        video_blur_movement_band_bottom: params.dig('video', 'blur', 'movement', 'band', 'bottom'),
        video_blur_movement_band_top: params.dig('video', 'blur', 'movement', 'band', 'top'),
        video_blur_movement_threshold: params.dig('video', 'blur', 'movement', 'threshold'),
        video_blur_blink_band_bottom: params.dig('video', 'blur', 'blink', 'band', 'bottom'),
        video_blur_blink_band_top: params.dig('video', 'blur', 'blink', 'band', 'top'),
        video_blur_blink_threshold: params.dig('video', 'blur', 'blink', 'threshold'),
      )
    end

    case params.dig('video', 'particle')
    when nil
    when ''
      attributes.merge!(
        video_particle_limit_band_bottom: 0,
        video_particle_limit_band_top: 0,
        video_particle_limit_threshold: 0,
        video_particle_color: nil,
      )
    else
      attributes.merge!(
        video_particle_limit_band_bottom: params.dig('video', 'particle', 'limit', 'band', 'bottom'),
        video_particle_limit_band_top: params.dig('video', 'particle', 'limit', 'band', 'top'),
        video_particle_limit_threshold: params.dig('video', 'particle', 'limit', 'threshold'),
        video_particle_color: params.dig('video', 'particle', 'color'),
      )
    end

    if params.dig('video', 'particle').present?
      attributes.merge! video_lightleaks: params.dig('video', 'lightleaks') != ''
    end

    case params.dig('video', 'spectrum')
    when nil
    when ''
      attributes.merge!(
        video_spectrum_mode: nil,
        video_spectrum_color: nil,
      )
    else
      attributes.merge!(
        video_spectrum_mode: params.dig('video', 'spectrum', 'mode'),
        video_spectrum_color: params.dig('video', 'spectrum', 'color'),
      )
    end

    @track_attributes = attributes
  end

  def status_params
    permitted = params.permit :title, :artist, :text, :visibility

    if ['public', 'unlisted'].exclude? permitted[:visibility]
      raise Mastodon::ValidationError, I18n.t('tracks.invalid_visibility')
    end

    permitted
  end

  def track_params
    params.permit :title, :artist, :text, :music
  end

  def music_duration
    return @music_duration if @music_duration

    Mp3Info.open track_params.require(:music).path do |m|
      @music_duration = m.length
    end
  rescue Mp3InfoError
    raise Mastodon::ValidationError, I18n.t('tracks.invalid_mp3')
  end
end
