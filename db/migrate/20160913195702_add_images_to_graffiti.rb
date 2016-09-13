class AddImagesToGraffiti < ActiveRecord::Migration[5.0]
  def change
    add_column :graffitis, :images, :json
  end
end
