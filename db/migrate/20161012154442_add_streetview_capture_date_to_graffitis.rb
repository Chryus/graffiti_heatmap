class AddStreetviewCaptureDateToGraffitis < ActiveRecord::Migration[5.0]
  def change
    add_column :graffitis, :streetview_capture_date, :datetime
  end
end
