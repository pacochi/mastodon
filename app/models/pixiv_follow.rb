class PixivFollow < ApplicationRecord
  belongs_to :oauth_authentication, required: true

  validates :target_pixiv_uid, presence: true
  validates :oauth_authentication_id, uniqueness: { scope: :target_pixiv_uid }
end
