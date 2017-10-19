# frozen_string_literal: true
# == Schema Information
#
# Table name: albums
#
#  id                 :integer          not null, primary key
#  title              :string           not null
#  text               :text             default(""), not null
#  image_file_name    :string
#  image_content_type :string
#  image_file_size    :integer
#  image_updated_at   :datetime
#

class Album < ApplicationRecord
  include Paginable

  before_save :truncate_title,  if: :title_changed?

  has_many :album_tracks, inverse_of: :album
  has_many :statuses, as: :music

  has_attached_file :image

  validates_attachment :image,
                       presence: true,
                       content_type: { content_type: ['image/jpeg', 'image/png'] },
                       size: { less_than: 7.megabytes }

  private

  def truncate_title
    self.title = self.title.slice(0, 128)
  end
end
