# frozen_string_literal: true

module AccountPawooMusicConcern
  extend ActiveSupport::Concern

  included do
    has_many :albums, inverse_of: :account
    has_many :tracks, inverse_of: :account, dependent: :destroy
  end
end
