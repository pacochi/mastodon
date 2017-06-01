require 'mp3info'
require 'streamio-ffmpeg'
require 'tempfile'

class MusicConvertService < BaseService
  def call(title, artist, music_file, image_file)
    # ffmpeg generates 60 extra silent frames at the end when you generate mp4 from png and mp3
    # we get the length of the mp3 file and trim the output to circumvent this issue
    music_length = Mp3Info.open(music_file.path, &:length)

    trans_opt = {
      loop: '1',
      r: '4',
      i: image_file.path,
    }

    temp = Tempfile.create(['music-', '.mp4'])
    # TODO: outputをTempfileにする
    FFMPEG::Transcoder.new(FFMPEG::Movie.new(music_file.path), temp.path,
                                 ['-vf', "scale='min(400,iw)':-2,format=yuv420p", '-c:v', 'libx264', '-shortest', '-c:a', 'copy', '-metadata', "title=#{title}", '-metadata', "artist=#{artist}"],
                                 input_options: trans_opt
    ).run

    temp

  end
end
