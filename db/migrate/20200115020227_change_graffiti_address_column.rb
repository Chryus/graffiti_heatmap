class ChangeGraffitiAddressColumn < ActiveRecord::Migration[5.0]
  def change
    rename_column :graffitis, :incident_address, :address
  end
end
