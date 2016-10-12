class AddHotspotToGraffitis < ActiveRecord::Migration[5.0]
  def change
    add_column :graffitis, :hotspot, :boolean, default: false
    add_index :graffitis, :hotspot
  end
end
