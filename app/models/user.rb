class User < ActiveRecord::Base  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, 
         :trackable, :validatable
  has_many :comments
  has_many :graffiti_through_uploads, foreign_key: "user_id", class_name: "Graffiti"
  has_many :upvotes
  has_many :graffiti_through_upvotes, through: :upvotes,
                                      :class_name => 'Graffiti', 
                                      :foreign_key => 'graffiti_id',
                                      :source => :graffiti

  def self.from_facebook(provider, user_info, access_token, expires_at)
    User.where(uid: user_info['id']).first_or_initialize.tap do |user|
      user.provider = provider
      user.uid = user_info['id']
      user.name = user_info['name']
      user.username = user_info['name'].split(" ").first
      user.email = user_info['email']
      user.oauth_token = access_token
      user.oauth_expires_at = Time.at(expires_at)
      user.save!(validate: false)
    end
  end

  def as_json(options={})
    user = super(:only => [:id, :name, :username, :oauth_token])
    user[:graffiti_images] = self.graffiti_through_uploads.pluck(:images).flatten
    user[:graffiti_through_upvotes] = self.graffiti_through_upvotes
    user
  end

end