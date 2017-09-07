# frozen_string_literal: true

class Api::V1::MusicsController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write }, except: :show
  before_action :require_user!, except: :show

  respond_to :json

  def create
    music_duration = update_music_info

    attributes = music_params.merge(duration: music_duration.ceil)

    if params.dig('video', 'blur')
      attributes.merge!(
        video_blur_movement_band_bottom: params.dig('video', 'blur', 'movement', 'band', 'bottom'),
        video_blur_movement_band_top: params.dig('video', 'blur', 'movement', 'band', 'top'),
        video_blur_movement_threshold: params.dig('video', 'blur', 'movement', 'threshold'),
        video_blur_blink_band_bottom: params.dig('video', 'blur', 'blink', 'band', 'bottom'),
        video_blur_blink_band_top: params.dig('video', 'blur', 'blink', 'band', 'top'),
        video_blur_blink_threshold: params.dig('video', 'blur', 'blink', 'threshold'),
      )
    end

    if params.dig('video', 'particle')
      attributes.merge!(
        video_particle_limit_band_bottom: params.dig('video', 'particle', 'limit', 'band', 'bottom'),
        video_particle_limit_band_top: params.dig('video', 'particle', 'limit', 'band', 'top'),
        video_particle_limit_threshold: params.dig('video', 'particle', 'limit', 'threshold'),
        video_particle_color: params.dig('video', 'particle', 'color'),
      )
    end

    if params.dig('video', 'spectrum')
      attributes.merge!(
        video_spectrum_mode: params.dig('video', 'spectrum', 'mode'),
        video_spectrum_color: params.dig('video', 'spectrum', 'color'),
      )
    end

    ApplicationRecord.transaction do
      status = Status.new(account: current_account, text: '', visibility: :unlisted)
      status.save! validate: false

      attributes.merge!(status: status)
      @music = MusicAttachment.create!(attributes)

      status.update! text: music_url(@music)
    end
  end

  def destroy
    music = MusicAttachment.find(params[:id])

    music.destroy!
    RemovalWorker.perform_async music.status_id

    render_empty
  end

  def show
    @music = MusicAttachment.find(params[:id])
  end

  private

  def music_params
    return @music_params if @music_params

    title, artist, music, image = params.require([:title, :artist, :music, :image])
    @music_params = { title: title, artist: artist, music: music, image: image }
  end

  def update_music_info
    Mp3Info.open music_params[:music].path do |m|
      m.tag2.remove_pictures
      m.length
    end
  rescue Mp3InfoError
    raise Mastodon::ValidationError, I18n.t('music_attachments.invalid_mp3')
  end
end
