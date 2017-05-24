class CreateTrendNgWords < ActiveRecord::Migration[5.0]
  def change
    create_table :trend_ng_words do |t|
      t.string :word

      t.timestamps
    end
  end
end
