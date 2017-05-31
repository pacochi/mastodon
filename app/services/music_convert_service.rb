class MusicConvertService < BaseService
  def call(title, artist, music_file, image_file)
    # ffmpeg generates 60 extra silent frames at the end when you generate mp4 from png and mp3
    # we get the length of the mp3 file and trim the output to circumvent this issue
    music_length = Mp3Info.open(file.path, &:length)
    # TODO: 色々頑張ってmp4を戻せるようにする
    results # mp4
  end
end
