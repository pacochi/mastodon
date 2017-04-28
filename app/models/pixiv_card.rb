# frozen_string_literal: true

class PixivCard < ApplicationRecord
  belongs_to :status, required: true
  validates :url, presence: true

  validate :validate_image_url, if: :image_url?

  def fetch_image_url
    return unless url?
    self.image_url = PixivUrl::PixivTwitterImage.cache_or_fetch(url)
  end

  private

  def validate_image_url
    errors.add(:image_url) unless PixivUrl.valid_twitter_image?(image_url)
  end
end
