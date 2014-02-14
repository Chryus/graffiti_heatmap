class UsersController < ApplicationController
  
  Dir['./model/*.rb'].each {|file| require file}

  def index
    @users = User.all
  end

  def new
    @user = User.new
  end

  def create
    #get user data from form
    @user = User.new(params[:user])
    if @user.save
      flash[:success] = "Let's find some graffiti."
      redirect_to user_path(@user)
    else
      render "new"
    end
  end

  def show
    @user = User.find(params[:id])
  end

end
