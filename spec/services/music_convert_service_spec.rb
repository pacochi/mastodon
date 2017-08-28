# frozen_string_literal: true

require 'rails_helper'

describe MusicConvertService do
  it 'converts into a video file with specified options' do
    skip 'skipped for environments without supported FFmpeg'

    extend ActionDispatch::TestProcess

    file = MusicConvertService.new.call(
      duration: 8,
      bitrate: 96,
      title: 'title',
      artist: 'artist',
      music: fixture_file_upload('files/aint_we_got_fun_billy_jones1921.mp3'),
      image: fixture_file_upload('files/attachment.jpg'),
    )

    expect(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 #{file.path}`).to eq "8.047000\n"
    expect(`ffprobe -v error -select_streams a -show_entries stream=bit_rate -of default=noprint_wrappers=1:nokey=1 #{file.path}`).to eq "96583\n"
    expect(`ffprobe -v error -show_entries tags=title -of default=noprint_wrappers=1:nokey=1 #{file.path}`).to eq "title\n"
    expect(`ffprobe -v error -show_entries tags=artist -of default=noprint_wrappers=1:nokey=1 #{file.path}`).to eq "artist\n"
  end
end
