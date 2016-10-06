class ChangeImagesColumnToJsonb < ActiveRecord::Migration[5.0]
  def change
    change_column(:graffitis, :images, 'jsonb USING CAST(images AS jsonb)')
  end
end
