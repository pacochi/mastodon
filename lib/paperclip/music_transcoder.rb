# frozen_string_literal: true

module Paperclip
  # This transcoder is only to be used for the MediaAttachment model
  # to convert music (currently mp3 only) and cover image to mp4
  class MusicTranscoder < Paperclip::Processor
    def make

      # ffmpeg generates 60 extra silent frames at the end when you generate mp4 from png and mp3
      # we get the length of the mp3 file and trim the output to circumvent this issue
      id3tags = Id3Tags.read_from_file(file.path)
      num_frames = id3tags[:length]

      meta = ::Av.cli.identify(@file.path)
      attachment.instance.type = MediaAttachment.types[:gifv] unless meta[:audio_encode]

      Paperclip::Transcoder.make(file, options, attachment)
    end
  end
end
