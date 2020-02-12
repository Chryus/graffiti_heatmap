class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery unless: -> { request.format.json? }

  rescue_from ActionController::InvalidAuthenticityToken do |exception|
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
    render :json => {error: 'invalid token'}, status: :unprocessable_entity
  end

  respond_to :json, :html

  before_action :configure_permitted_parameters, if: :devise_controller?
  after_action :set_csrf_cookie_for_ng

  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  def angular
    render 'layouts/application'
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:login, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:account_update, keys: [:username, :email, :password, :password_confirmation, :current_password])
  end

  def current_user
    @current_user = super || (User.find(session[:user_id]) if session[:user_id])
  end

  def verified_request?
    super || valid_authenticity_token?(session, request.headers['X-XSRF-TOKEN'])
  end
end
