# frozen_string_literal: true

module Paperclip
  class MusicTranscoder < Paperclip::Processor
    def make
      @file
    end
  end
end
