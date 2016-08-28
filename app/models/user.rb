class User < ActiveRecord::Base  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_many :comments
  has_many :upvotes
  has_many :graffiti, through: :upvotes

  def as_json(options={})
    user = super(:only => [:username])
    user[:graffiti] = self.graffiti
    user
  end

end