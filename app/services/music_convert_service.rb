class MusicConvertService < BaseService
  def call(music)
    music_file = Tempfile.new
    begin
      music.music.copy_to_local_file :original, music_file.path

      image_file = nil
      begin
        if music.video_image.present?
          image_file = Tempfile.new
          music.video_image.copy_to_local_file :original, image_file.path
        end

        musicvideo = open_musicvideo(music, music_file, image_file)

        video_file = Tempfile.new(['music-', '.mp4'])
        begin
          create_mp4 music, music_file, musicvideo, video_file
          video_file
        rescue
          video_file.unlink
          raise
        end
      ensure
        image_file&.unlink
      end
    ensure
      music_file.unlink
    end
  end

  private

  def open_musicvideo(music, music_file, image_file)
    args = [
      Rails.root.join('node_modules', '.bin', 'electron'), 'genmv', '--',
      music_file.path, '--text-title', music.title, '--text-sub', music.artist,
    ]

    if image_file.present?
      args.push '--image', image_file.path
    end

    if music.video_blur_movement_band_top != 0 && music.video_blur_blink_band_top != 0
      args.push(
        '--blur-movement-band-top', music.video_blur_movement_band_top,
        '--blur-movement-band-bottom', music.video_blur_movement_band_bottom,
        '--blur-movement-threshold', music.video_blur_movement_threshold,
        '--blur-blink-band-top', music.video_blur_blink_band_top,
        '--blur-blink-band-bottom', music.video_blur_blink_band_bottom,
        '--blur-blink-threshold', music.video_blur_blink_threshold,
      )
    end

    if music.video_particle_color.present?
      args.push(
        '--particle-limit-band-top', music.video_particle_limit_band_top,
        '--particle-limit-band-bottom', music.video_particle_limit_band_bottom,
        '--particle-limit-threshold', music.video_particle_limit_threshold,
      )
    end

    if music.video_spectrum_mode.present? && music.video_spectrum_color.present?
      args.push(
        '--spectrum-mode', music.video_spectrum_mode,
        '--spectrum-color', music.video_spectrum_color,
      )
    end

    IO.popen args.map(&:to_s)
  end

  def create_mp4(music, music_file, musicvideo, video_file)
    args = [
      '-v', '-8', '-y',  '-i', music_file.path, '-f', 'rawvideo',
      '-framerate', '30', '-pixel_format', 'bgr32', '-video_size', '600x600',
      '-i', 'pipe:', '-vf', 'format=yuv420p,vflip', '-c:v', 'libx264', '-ar',
      '44100', '-c:a', 'libfdk_aac', '-metadata', "title=#{music.title}",
      '-metadata', "artist=#{music.artist}",
      video_file.path,
    ]

    Process.waitpid spawn('ffmpeg', *args, in: musicvideo)
    raise Mastodon::FFmpegError, $?.inspect unless $?.success?
  end
end
