class UsersController < ApplicationController
  def index
    @users = User.all
  end

  def create
    #get user data from form
    @user = User.new(params[:user])
    @user.save
      flash[:success] = "Let's find some graffiti."
      redirect_to user_path(@user)
    else
      render "new"
    end
  end
end
