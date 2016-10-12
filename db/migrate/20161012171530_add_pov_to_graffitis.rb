class AddPovToGraffitis < ActiveRecord::Migration[5.0]
  def change
    add_column :graffitis, :pov, :jsonb
  end
end
