class MusicConvertService < BaseService
  def call(title, artist, music_file, image_file)
    # ffmpeg generates 60 extra silent frames at the end when you generate mp4 from png and mp3
    # we get the length of the mp3 file and trim the output to circumvent this issue
    music_length = nil
    bitrate = nil
    Mp3Info.open(music_file.path) do |mp3info|
      music_length = mp3info.length
      bitrate = mp3info.bitrate
    end

    trans_opt = {
      loop: '1',
      r: '4',
      i: image_file.path,
    }

    options = [
      '-vf', 'format=yuv420p', '-c:v', 'libx264', '-tune', 'stillimage',
      '-c:a', 'copy',
      '-shortest', '-t', "#{music_length}",
      '-metadata', "title=#{title}", '-metadata', "artist=#{artist}",
    ]

    temp = Tempfile.create(['music-', '.mp4'])
    FFMPEG::Transcoder.new(FFMPEG::Movie.new(music_file.path), temp.path, options, input_options: trans_opt).run

    temp

  end
end
