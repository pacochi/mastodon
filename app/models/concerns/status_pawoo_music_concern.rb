# frozen_string_literal: true

module StatusPawooMusicConcern
  extend ActiveSupport::Concern

  included do
    after_destroy { self.music&.destroy! unless self.reblog? }
    belongs_to :music, polymorphic: true
    scope :musics_only, -> { where.not(music_type: nil) }
  end

  class_methods do
    def next_id
      ApplicationRecord.connection.select_value "SELECT nextval('statuses_id_seq')"
    end
  end
end
