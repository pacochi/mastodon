class PixivFollow < ApplicationRecord
  belongs_to :oauth_authentication, required: true

  validates :target_pixiv_uid, presence: true
  validates :oauth_authentication_id, uniqueness: { scope: :target_pixiv_uid }

  def self.synchronize!(uids)
    raise 'without scope' unless scope_attributes.present?

    exists = pluck(:target_pixiv_uid)

    deleted_uids = exists - uids
    new_uid_attributes = (uids - exists).map { |uid| { target_pixiv_uid: uid } }

    transaction do
      where(target_pixiv_uid: deleted_uids).delete_all
      create!(new_uid_attributes)
    end
  end
end
