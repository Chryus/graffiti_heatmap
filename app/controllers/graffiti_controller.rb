class GraffitiController < ApplicationController
  Dir['./model/*.rb'].each {|file| require file}

  def index
    @graffiti = Graffiti.all
    File.read(File.join('public/app', 'index.html'))
  end

  def geocoded_graffiti
    @geocoded_graffiti = Graffiti.geocode_graffiti
    render :json => @geocoded_graffiti
  end

  private

  def graffiti_params
    params.require(:graffiti).permit(:latitude, :longitude, :y_coordinate, :x_coordinate, :borough, :status, :incident_address)
  end
end