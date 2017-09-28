# frozen_string_literal: true

module AccountPawooMusicConcern
  extend ActiveSupport::Concern

  included do
    has_many :albums, inverse_of: :account
    has_many :music_attachments, inverse_of: :account, dependent: :destroy
  end
end
