class AddLatitudeAndLongitudeToModel < ActiveRecord::Migration
  def change
    add_column :graffitis, :latitude, :float
    add_column :graffitis, :longitude, :float
  end
end
