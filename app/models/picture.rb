class Picture < ActiveRecord::Base

  attr_accessible :address, :borough, :description

  belongs_to :user
end
