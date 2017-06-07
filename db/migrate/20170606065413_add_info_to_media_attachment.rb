class AddInfoToMediaAttachment < ActiveRecord::Migration[5.0]
  def change
    add_column :media_attachments, :music_info, :json, null: true, default: nil
  end
end
