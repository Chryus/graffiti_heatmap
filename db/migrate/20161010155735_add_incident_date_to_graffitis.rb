class AddIncidentDateToGraffitis < ActiveRecord::Migration[5.0]
  def change
    add_column :graffitis, :incident_date, :datetime
  end
end
