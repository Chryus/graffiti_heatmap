class UsersController < ApplicationController

  def show
    user = User.find(params[:id])
    respond_with user
  end

  def create_from_facebook
    user_info, access_token = Omniauth::Facebook.authenticate(params['code'])
    user = User.from_facebook('facebook', user_info, access_token)
    respond_with user
  end

end