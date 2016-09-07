class User < ActiveRecord::Base  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, 
         :trackable, :validatable
  has_many :comments
  has_many :upvotes
  has_many :graffiti, through: :upvotes

  def self.from_facebook(provider, user_info, access_token)
    User.where(uid: user_info['id']).first_or_initialize.tap do |user|
      user.provider = provider
      user.uid = user_info['id']
      user.name = user_info['name']
      user.oauth_token = access_token
      user.save!(validate: false)
    end
  end

  def as_json(options={})
    user = super(:only => [:id, :username])
    user[:graffiti] = self.graffiti
    user
  end

end