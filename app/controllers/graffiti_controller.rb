class GraffitiController < ApplicationController

  def index
    @geocode_graffiti = Graffiti.geocode_graffiti
    render :json => @geocode_graffiti
  end

  def get_graffiti
    @get_graffiti = Graffiti.all
    render :json => @get_graffiti
  end

  private

  def graffito_params
    params.require(:graffito).permit(:borough, :status, :incident_address, :latitude, :longitude)
  end

end
