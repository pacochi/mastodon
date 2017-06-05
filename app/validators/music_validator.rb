# frozen_string_literal: true

class MusicValidator < ActiveModel::Validator

  MAX_SIZE_IN_MB = 7
  MUSIC_MIME_TYPES = ['audio/mp3', 'audio/mpeg'].freeze
  IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'].freeze

  def validate(record)
    return if record.music.nil? || record.image.nil?
    record.errors.add(:base, I18n.t('music_attachments.too_large_total_size', max_size_in_mb: MAX_SIZE_IN_MB)) unless within_limit_size?(record)
    record.errors.add(:music, I18n.t('music_attachments.invalid_music_ext')) unless valid_music_extension?(record)
    record.errors.add(:image, I18n.t('music_attachments.invalid_image_ext')) unless valid_image_extension?(record)
  end

  def within_limit_size?(record)
     return ( File.size(record.music.path) + File.size(record.image.path) ) / 1024000 < MAX_SIZE_IN_MB
  end

  def valid_music_extension?(record)
    mime_type = FileMagic.new(FileMagic::MAGIC_MIME).file(record.music.path)
    return MUSIC_MIME_TYPES.any? { |m| mime_type.include? m }
  end

  def valid_image_extension?(record)
    mime_type = FileMagic.new(FileMagic::MAGIC_MIME).file(record.image.path)
    return IMAGE_MIME_TYPES.any? { |m| mime_type.include? m }
  end

end
