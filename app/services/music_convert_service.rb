class MusicConvertService < BaseService
  def call(music)
    # ffmpeg generates 60 extra silent frames at the end when you generate mp4 from png and mp3
    # we get the length of the mp3 file and trim the output to circumvent this issue
    music_file = Tempfile.new
    begin
      music.music.copy_to_local_file :original, music_file.path

      music_length = nil
      bitrate = nil
      Mp3Info.open(music_file) do |mp3info|
        music_length = mp3info.length
        bitrate = mp3info.bitrate
      end

      options = [
        '-vf', 'format=yuv420p,scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264', '-tune', 'stillimage',
        '-ac', '2', '-ar', '44100', '-b:a', "#{bitrate}k", '-c:a', 'libfdk_aac', '-afterburner', '1',
        '-shortest', '-t', "#{music_length}",
        '-metadata', "title=#{music.title}", '-metadata', "artist=#{music.artist}",
      ]

      image_file = Tempfile.new
      begin
        music.image.copy_to_local_file :original, image_file.path

        trans_opt = {
          loop: '1',
          r: '4',
          i: image_file.path,
        }

        video_file = Tempfile.new(['music-', '.mp4'])
        begin
          FFMPEG::Transcoder.new(FFMPEG::Movie.new(music_file.path), video_file.path, options, input_options: trans_opt).run
          video_file
        rescue
          video_file.unlink
          raise
        end
      ensure
        image_file.unlink
      end
    ensure
      music_file.unlink
    end
  end
end
