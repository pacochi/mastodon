class CreateSuggestionTags < ActiveRecord::Migration[5.0]
  def change
    create_table :suggestion_tags do |t|
      t.string :description, null: false
      t.integer :order, null: false
      t.belongs_to :tag, null: false, :unique => true
      t.timestamps
    end
  end
end
