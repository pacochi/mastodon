class CreatePinnedStatuses < ActiveRecord::Migration[5.0]
  def change
    create_table :pinned_statuses do |t|
      t.integer :account_id, null: false
      t.bigint :status_id, null: false
      t.timestamps null: false

      t.index [:account_id, :status_id], unique: true
      t.foreign_key :accounts
      t.foreign_key :statuses
    end
  end
end
