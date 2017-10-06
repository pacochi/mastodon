# frozen_string_literal: true

class Api::V1::TracksController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write }, except: :show
  before_action :require_user!, except: :show

  respond_to :json

  def create
    params.require [:title, :artist, :music]

    @track = Track.create!(track_attributes)

    status_text = short_account_track_url(current_account.username, @track)
    unless status_params[:text].blank?
      status_text = [status_params[:text], status_text].join(' ')
    end

    begin
      @status = PostStatusService.new.call(
        current_account,
        status_text,
        nil,
        visibility: status_params[:visibility],
        application: doorkeeper_token.application
      )
    rescue
      @track.destroy!
      raise
    end

    @track.update! status: @status
    render 'api/v1/statuses/show'
  end

  def update
    @track = Track.find_by!(id: params.require(:id), account: current_account)
    @track.update! track_attributes
    @status = @track.status
    render 'api/v1/statuses/show'
  end

  def destroy
    track = Track.find_by!(id: params.require(:id), account: current_account)

    track.destroy!
    RemovalWorker.perform_async track.status_id

    render_empty
  end

  def show
    @track = Track.find(params.require(:id))
    @status = @track.status
    render 'api/v1/statuses/show'
  end

  def prepare_video
    track = Track.find_by!(id: params.require(:id), account: current_account)
    VideoPreparingWorker.perform_async track.id

    render_empty
  end

  private

  def track_attributes
    return @track_attributes if @track_attributes

    attributes = track_params
    attributes.merge! account: current_account

    if track_params[:music].present?
      music_duration = update_music
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

  def update_music
    return @updated_music_duration if @updated_music_duration

    Mp3Info.open track_params[:music].path do |m|
      m.tag2.remove_pictures
      @updated_music_duration = m.length
    end
  rescue Mp3InfoError
    raise Mastodon::ValidationError, I18n.t('tracks.invalid_mp3')
  end
end
