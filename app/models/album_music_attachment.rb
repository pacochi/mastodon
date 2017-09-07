# frozen_string_literal: true

class AlbumMusicAttachment < ApplicationRecord
  belongs_to :album
  belongs_to :music_attachment
end
