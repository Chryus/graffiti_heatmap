class CreateGraffitis < ActiveRecord::Migration
  def change
    create_table :graffitis do |t|
      t.float :y_coordinate
      t.float :x_coordinate
      t.string :borough
      t.string :status
      t.string :incident_address
      t.timestamps
    end
  end
end
