class UsersController < ApplicationController

  def show
    user = User.find(params[:id])
    respond_with user
  end

  def facebook_login
    user_info, access_token = Omniauth::Facebook.authenticate(params['code'])
    if user_info['email'].blank?
      Omniauth::Facebook.deauthorize(access_token)
    end
  end
end