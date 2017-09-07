object @music

attribute :id, :title, :artist

node :music { |music| full_asset_url(music.music.url(:original)) }
node :image { |music| full_asset_url(music.image.url(:original)) }

node :video do |music|
  hash = {}

  if music.video_blur_movement_band_top != 0 && music.video_blur_blink_band_top != 0
    hash[:blur] = {
      movement: {
        band: {
          top: music.video_blur_movement_band_top,
          bottom: music.video_blur_movement_band_bottom,
        },
        threshold: music.video_blur_movement_threshold,
      },
      blink: {
        band: {
          top: music.video_blur_blink_band_top,
          bottom: music.video_blur_blink_band_bottom,
        },
        threshold: music.video_blur_blink_threshold,
      },
    }
  end

  if music.video_particle_color.present?
    hash[:particle] = {
      limit: {
        band: {
          top: music.video_particle_limit_band_top,
          bottom: music.video_particle_limit_band_bottom,
        },
        threshold: music.video_particle_limit_threshold,
      },
      color: music.video_particle_color,
    }
  end

  if music.video_spectrum_mode.present? && music.video_spectrum_color.present?
    hash[:spectrum] = {
      mode: music.video_spectrum_mode,
      color: music.video_spectrum_color,
    }
  end

  hash
end

child :status { extends 'api/v1/statuses/show' }
