class AddStatusesIndexOnReblogOfIdMusicTypeId < ActiveRecord::Migration[5.1]
  def change
    add_index :statuses, [:music_type, :id]
  end
end
