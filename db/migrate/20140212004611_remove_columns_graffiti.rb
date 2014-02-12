class RemoveColumnsGraffiti < ActiveRecord::Migration
  def change
    remove_column :graffitis, :x_coordinate, :float
    remove_column :graffitis, :y_coordinate, :float
  end
end
