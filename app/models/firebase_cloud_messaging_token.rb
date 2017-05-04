# frozen_string_literal: true

class FirebaseCloudMessagingToken < ApplicationRecord
  belongs_to :user, required: true

  enum platform: %i(iOS android)

  validates :platform, :token, presence: true
  validates :token, uniqueness: true, format: { with: /\A[a-zA-Z0-9_:\-]+\z/ }
end
