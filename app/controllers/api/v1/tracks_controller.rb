# frozen_string_literal: true

class Api::V1::TracksController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write }, except: :show
  before_action :require_user!, except: :show

  respond_to :json

  def create
    params.require [:title, :artist, :music]
    attributes = prepare_music_attributes

    ApplicationRecord.transaction do
      status = Status.new(account: current_account, text: '', visibility: :unlisted)
      status.save! validate: false

      attributes.merge!(status: status)
      @track = MusicAttachment.create!(attributes)

      status.update! text: short_account_track_url(current_account.username, @track)
    end
  end

  def update
    attributes = prepare_music_attributes
    @track = MusicAttachment.joins(:status).find_by!(id: params.require(:id), statuses: { account: current_account })
    @track.update! attributes
  end

  def destroy
    music = MusicAttachment.joins(:status).find_by!(id: params.require(:id), statuses: { account: current_account })

    music.destroy!
    RemovalWorker.perform_async music.status_id

    render_empty
  end

  def show
    @track = MusicAttachment.find(params.require(:id))
  end

  def prepare_video
    track = MusicAttachment.joins(:status).find_by!(id: params.require(:id), statuses: { account: current_account })
    VideoPreparingWorker.perform_async track.id

    render_empty
  end

  private

  def prepare_music_attributes
    return @prepared_music_attributes if @prepared_music_attributes

    attributes = music_params

    if music_params[:music].present?
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

    @prepared_music_attributes = attributes
  end

  def music_params
    params.permit :title, :artist, :description, :music
  end

  def update_music
    return @updated_music_duration if @updated_music_duration

    Mp3Info.open music_params[:music].path do |m|
      m.tag2.remove_pictures
      @updated_music_duration = m.length
    end
  rescue Mp3InfoError
    raise Mastodon::ValidationError, I18n.t('music_attachments.invalid_mp3')
  end
end
