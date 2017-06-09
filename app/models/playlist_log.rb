# == Schema Information
#
# Table name: playlist_logs
#
#  id                 :integer          not null, primary key
#  uuid               :string           not null
#  deck               :integer          not null
#  info               :string           default(""), not null
#  link               :string           not null
#  account_id         :integer          not null
#  started_at         :datetime
#  skipped_account_id :integer
#  skipped_at         :datetime
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

class PlaylistLog < ApplicationRecord
  belongs_to :account, required: true
  belongs_to :skipped_account, class_name: 'Account'

  validates :uuid, uniqueness: true, presence: true
  validates :deck, presence: true, inclusion: { in: 1..3 }
  validates :link, presence: true
end
