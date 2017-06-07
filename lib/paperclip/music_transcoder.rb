# frozen_string_literal: true

module Paperclip
  class MusicTranscoder < Paperclip::Processor
    def make
      File.open(@file.path)
    end
  end
end
