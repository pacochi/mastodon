require 'mp3info'
require 'streamio-ffmpeg'
require 'tempfile'

class MusicConvertService < BaseService
  def call(title, artist, music_file, image_file)
    # ffmpeg generates 60 extra silent frames at the end when you generate mp4 from png and mp3
    # we get the length of the mp3 file and trim the output to circumvent this issue
    music_length = Mp3Info.open(music_file.path, &:length)

    options = {
      video_codec: 'libx264',
      resolution: '320x240',
      video_bitrate: 300,
      audio_codec: 'libmp3lame',
      audio_bitrate: 192,
      audio_sample_rate: 44100,
      audio_channels: 2,
      duration: music_length.to_i,
      custom: ['-i', FFMPEG::Movie.new(music_file.path).path, '-metadata', "title=#{title}", '-metadata', "artist=#{artist}"],
    }

    # TODO: outputをTempfileにする
    mp4 = FFMPEG::Transcoder.new(nil, '/Users/orekyuu/Desktop/test.mp4',
                                 options,
                                 input: image_file.path,
                                 input_options: { loop: '1', r: '4' }
    ).run
    raise 'おらおら'

  end
end
