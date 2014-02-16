Dir['./model/*.rb'].each {|file| require file}

class GraffitiController < ApplicationController

  def index
    @geo_graffiti = Graffiti.geocode_graffiti
    render :json => @geo_graffiti
  end

  def get_graffiti
    @get_graffiti = Graffiti.all.to_json
    render :json => @get_graffiti
  end

end