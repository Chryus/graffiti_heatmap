class CreatePictures < ActiveRecord::Migration
  def change
    create_table :pictures do |t|
      t.string :address
      t.string :borough
      t.string :description

      t.timestamps
    end
  end
end
