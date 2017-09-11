object @track

attribute :id, :title, :artist

node :music { |track| full_asset_url(track.music.url(:original)) }
node :image { |track| full_asset_url(track.image.url(:original)) }

node :video do |track|
  hash = {}

  hash[:url] = full_asset_url(track.video.url(:original)) if track.video.present?

  if track.video_blur_movement_band_top != 0 && track.video_blur_blink_band_top != 0
    hash[:blur] = {
      movement: {
        band: {
          top: track.video_blur_movement_band_top,
          bottom: track.video_blur_movement_band_bottom,
        },
        threshold: track.video_blur_movement_threshold,
      },
      blink: {
        band: {
          top: track.video_blur_blink_band_top,
          bottom: track.video_blur_blink_band_bottom,
        },
        threshold: track.video_blur_blink_threshold,
      },
    }
  end

  if track.video_particle_color.present?
    hash[:particle] = {
      limit: {
        band: {
          top: track.video_particle_limit_band_top,
          bottom: track.video_particle_limit_band_bottom,
        },
        threshold: track.video_particle_limit_threshold,
      },
      color: track.video_particle_color,
    }
  end

  if track.video_spectrum_mode.present? && track.video_spectrum_color.present?
    hash[:spectrum] = {
      mode: track.video_spectrum_mode,
      color: track.video_spectrum_color,
    }
  end

  hash
end

child :status { extends 'api/v1/statuses/show' }
