class AddUpvotesToGraffiti < ActiveRecord::Migration[5.0]
  def change
    add_column :graffitis, :upvotes, :integer, default: 0
  end
end
