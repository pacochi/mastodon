# frozen_string_literal: true

module StatusPawooMusicConcern
  extend ActiveSupport::Concern

  included do
    has_one :album, inverse_of: :status
    has_one :music_attachment, inverse_of: :status, dependent: :destroy
  end
end
