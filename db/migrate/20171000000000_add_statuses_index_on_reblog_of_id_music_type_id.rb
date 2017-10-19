class AddStatusesIndexOnReblogOfIdMusicTypeId < ActiveRecord::Migration[5.1]
  def change
    add_index :statuses, [:music_type, :reblog_of_id, :id]
  end
end
