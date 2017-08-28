class MusicConvertService < BaseService
  def call(duration:, bitrate:, title:, artist:, music:, image:)
    trans_opt = {
      loop: '1',
      r: '4',
      i: image.path,
    }

    options = [
      '-vf', 'format=yuv420p,scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264', '-tune', 'stillimage',
      '-ac', '2', '-ar', '44100', '-b:a', "#{bitrate}k", '-c:a', 'libfdk_aac', '-afterburner', '1',
      '-shortest', '-t', "#{duration}",
      '-metadata', "title=#{title}", '-metadata', "artist=#{artist}",
    ]

    temp = Tempfile.new(['music-', '.mp4'])
    FFMPEG::Transcoder.new(FFMPEG::Movie.new(music.path), temp.path, options, input_options: trans_opt).run

    temp

  end
end
