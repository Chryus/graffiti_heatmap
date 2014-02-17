Dir['./model/*.rb'].each {|file| require file}

class GraffitiController < ApplicationController

  def index
    @geo_graffiti = Graffiti.geocode_graffiti
    render :json => @geo_graffiti
  end

  def get_graffiti
    @get_graffiti = Graffiti.purge_empty_latitudes
    render :json => @get_graffiti
  end

end