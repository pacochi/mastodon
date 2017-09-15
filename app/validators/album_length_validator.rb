# frozen_string_literal: true

class AlbumLengthValidator < ActiveModel::Validator
  MAX_CHARS = 500

  def validate(album)
    album.errors.add(:description, I18n.t('albums.over_character_limit', max: MAX_CHARS)) if album.description.mb_chars.grapheme_length > MAX_CHARS
  end
end
