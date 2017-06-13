class RemovePixivFollows < ActiveRecord::Migration[5.0]
  def change
    drop_table :pixiv_follows
  end
end
