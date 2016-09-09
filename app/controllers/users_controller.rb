class UsersController < ApplicationController

  def show
    user = User.find(params[:id])
    respond_with user
  end

  def create_from_facebook
    user_info, access_token, expires_at = Omniauth::Facebook.authenticate(params['code'])
    user = User.from_facebook('facebook', user_info, access_token, expires_at)
    session[:user_id] = user.id
    render json: user 
  end

  def from_token
    user = User.find_by(oauth_token: params[:token])
    if DateTime.now < user.oauth_expires_at
      session[:user_id] = user.id
      respond_with user
    else
      respond_with errors: "Token is expired", status: 401
    end
  end
end