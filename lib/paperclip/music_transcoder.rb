# frozen_string_literal: true

module Paperclip
  # This transcoder is only to be used for the MediaAttachment model
  # to convert music (currently mp3 only) and cover image to mp4
  class MusicTranscoder < Paperclip::Processor
    def make

      # ffmpeg generates 60 extra silent frames at the end when you generate mp4 from png and mp3
      # we get the length of the mp3 file and trim the output to circumvent this issue
      music_length = Mp3Info.open(file.path, &:length)

      Paperclip::Transcoder.make(file, options, attachment)
    end
  end
end
