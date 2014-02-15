Dir['./model/*.rb'].each {|file| require file}

class GraffitiController < ApplicationController

  def index
    @graffiti = Graffiti.geocode_graffiti
    render :json => @graffiti
  end

end