class GraffitiController < ApplicationController
  Dir['./model/*.rb'].each {|file| require file}

  def index
    @graffiti = Graffiti.all
  end

  def geocoded_graffiti
    @geocoded_graffiti = Graffiti.map_graffiti
    render :json => @geocoded_graffiti
  end

end
