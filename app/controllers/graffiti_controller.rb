

class GraffitiController < ApplicationController
  Dir['./model/*.rb'].each {|file| require file}

  def index
    File.read(File.join('public/app/index.html'))
    @graffiti = Graffiti.all
  end

  def geocoded_graffiti
    @geocoded_graffiti = Graffiti.geocode_graffiti
    render :json => @geocoded_graffiti
  end


  #  get '/' do
  #   File.read(File.join('public/app', 'index.html'))
  # end

  # get '/spacecats' do
  #   @spacecats = Spacecat.all

  #   @spacecats.to_json
  # end

  private

  def graffiti_params
    params.require(:graffiti).permit(:latitude, :longitude, :y_coordinate, :x_coordinate, :borough, :status, :incident_address)
  end
end