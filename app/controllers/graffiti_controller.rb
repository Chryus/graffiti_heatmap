class GraffitiController < ApplicationController

  def index
    graffiti = Graffiti.all
    heatmap_format = Graffiti.heatmap_format
    render json: {graffiti: graffiti, heatmap: heatmap_format}
  end

  def show
    respond_with Graffiti.find(params[:id])
  end

  def upvote
    graffito = Graffiti.find(params[:id])
    graffito.increment!(:upvotes)

    respond_with graffito
  end
  
  private

  def graffito_params
    params.require(:graffito).permit(:borough, :status, :incident_address, :latitude, :longitude)
  end

end