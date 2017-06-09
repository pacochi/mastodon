class CreatePlaylistLogs < ActiveRecord::Migration[5.0]
  def change
    create_table :playlist_logs do |t|
      t.string :uuid, null: false
      t.integer :deck, null: false
      t.string :info, null: false, default: ''
      t.string :link, null: false
      t.integer :account_id, null: false
      t.timestamp :started_at
      t.integer :skipped_account_id
      t.timestamp :skipped_at

      t.timestamps
      t.index :uuid, unique: true
    end
  end
end
