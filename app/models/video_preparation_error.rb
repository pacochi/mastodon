# frozen_string_literal: true
# == Schema Information
#
# Table name: video_preparation_errors
#
#  id       :integer          not null, primary key
#  track_id :integer          not null
#


class VideoPreparationError < ApplicationRecord
  belongs_to :track, inverse_of: :video_preparation_errors
  has_one :notification, as: :activity, dependent: :destroy
end
