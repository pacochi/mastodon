class CreateMusicTables < ActiveRecord::Migration[5.1]
  def change
    create_table :albums do |t|
      t.belongs_to :account, foreign_key: { on_delete: :cascade, on_update: :cascade }, null: false
      t.belongs_to :status, foreign_key: { on_delete: :cascade, on_update: :cascade }, null: false
      t.string :title, null: false
      t.text :description, default: '', null: false
      t.attachment :image
    end

    create_table :music_attachments do |t|
      t.belongs_to :account, foreign_key: { on_delete: :cascade, on_update: :cascade }, null: false
      t.belongs_to :status, foreign_key: { on_delete: :cascade, on_update: :cascade }, null: false
      t.integer :duration, null: false
      t.string :title, null: false
      t.string :artist, null: false
      t.string :description, default: '', null: false
      t.attachment :music
      t.attachment :video
      t.attachment :video_image
      t.integer :video_blur_movement_band_bottom, default: 0, null: false
      t.integer :video_blur_movement_band_top, default: 0, null: false
      t.integer :video_blur_movement_threshold, default: 0, null: false
      t.integer :video_blur_blink_band_bottom, default: 0, null: false
      t.integer :video_blur_blink_band_top, default: 0, null: false
      t.integer :video_blur_blink_threshold, default: 0, null: false
      t.integer :video_particle_limit_band_bottom, default: 0, null: false
      t.integer :video_particle_limit_band_top, default: 0, null: false
      t.integer :video_particle_limit_threshold, default: 0, null: false
      t.integer :video_particle_color
      t.integer :video_spectrum_mode
      t.integer :video_spectrum_color
    end

    create_table :album_music_attachments do |t|
      t.belongs_to :album, foreign_key: { on_delete: :cascade, on_update: :cascade }, null: false
      t.belongs_to :music_attachment, foreign_key: { on_delete: :cascade, on_update: :cascade }, null: false
      t.decimal :position, null: false

      # Specify the name manually since the length of the default name exceeds
      # the limit.
      t.index [:album_id, :music_attachment_id], unique: true, name: 'index_album_music_attachments_on_album_music_attachment'
      t.index [:album_id, :position], unique: true, name: 'index_album_music_attachments_on_album_position'
    end
  end
end
