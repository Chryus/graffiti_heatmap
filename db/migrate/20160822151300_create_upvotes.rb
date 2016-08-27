class CreateUpvotes < ActiveRecord::Migration[5.0]
  def change
    create_table :upvotes do |t|
      t.references :user, foreign_key: true
      t.references :graffiti, foreign_key: true

      t.timestamps
    end
    add_index :upvotes, [:user_id,:graffiti_id], unique: true
  end
end
