class CreatePlaylists < ActiveRecord::Migration[5.0]
  def change
    create_table :playlists do |t|
      t.integer :deck, null: false
      t.string :name, null: false, default: ''
      t.integer :deck_type, null: false, default: 0
      t.boolean :write_protect, null: false, default: false
      t.timestamps

      t.index :deck , unique: true
    end
  end
end
