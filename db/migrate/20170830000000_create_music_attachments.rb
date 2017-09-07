class CreateMusicAttachments < ActiveRecord::Migration[5.1]
  def change
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
  end
end
