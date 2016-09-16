class AddUserIdToGraffiti < ActiveRecord::Migration[5.0]
  def change
    add_column :graffitis, :user_id, :integer
    add_index :graffitis, :user_id
  end
end
