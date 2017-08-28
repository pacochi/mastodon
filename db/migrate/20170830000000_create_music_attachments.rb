class CreateMusicAttachments < ActiveRecord::Migration[5.1]
  def change
    create_table :music_attachments do |t|
      t.belongs_to :media_attachment, foreign_key: { on_delete: :cascade, on_update: :cascade }, null: false
      t.integer :duration, null: false
      t.string :title, null: false
      t.string :artist, null: false
      t.attachment :music
      t.attachment :image
    end

    reversible do |dir|
      dir.up do
        MediaAttachment.where.not(music_info: nil).select(:id, :music_info).find_in_batches do |group|
          group.each do |media|
            MusicAttachment.create!(
              media_attachment: media,
              duration: media.music_info['duration'],
              title: media.music_info['title'],
              artist: media.music_info['artist'],
            )
          end
        end
      end

      dir.down do
        MediaAttachment.joins(:music_attachment).includes(:music_attachment).find_in_batches do |group|
          group.each do |media|
            p media
            media.update!(music_info: {
              duration: media.music_attachment.duration,
              title: media.music_attachment.title,
              artist: media.music_attachment.artist,
            })
          end
        end
      end
    end

    remove_column :media_attachments, :music_info, :json
  end
end
