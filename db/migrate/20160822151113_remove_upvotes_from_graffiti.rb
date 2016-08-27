class RemoveUpvotesFromGraffiti < ActiveRecord::Migration[5.0]
  def change
    remove_column :graffitis, :upvotes, :integer
  end
end
