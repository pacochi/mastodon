class CreateMusicTables < ActiveRecord::Migration[5.1]
  def change
    create_table :albums do |t|
      t.belongs_to :status, foreign_key: { on_delete: :cascade, on_update: :cascade }, null: false
      t.string :title, null: false
      t.text :description, default: '', null: false
      t.attachment :image
    end

    create_table :music_attachments do |t|
      t.belongs_to :status, foreign_key: { on_delete: :cascade, on_update: :cascade }, null: false
      t.integer :duration, null: false
      t.string :title, null: false
      t.string :artist, null: false
      t.attachment :music
      t.attachment :image
      t.attachment :video
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

    create_table :albums_music_attachments do |t|
      t.belongs_to :album, foreign_key: { on_delete: :cascade, on_update: :cascade }, null: false
      t.belongs_to :music_attachment, foreign_key: { on_delete: :cascade, on_update: :cascade }, null: false
      t.integer :next
    end

    add_foreign_key :albums_music_attachments,
                    :albums_music_attachments,
                    column: :next,
                    on_delete: :restrict,
                    on_update: :cascade
  end
end
