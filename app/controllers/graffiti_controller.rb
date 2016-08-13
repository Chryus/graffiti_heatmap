class GraffitiController < ApplicationController

  def index
    @graffiti = Graffiti.all
    @heatmap_format = Graffiti.heatmap_format
    render :json => {graffiti: @graffiti, heatmap: @heatmap_format}
  end

  private

  def graffito_params
    params.require(:graffito).permit(:borough, :status, :incident_address, :latitude, :longitude)
  end

end