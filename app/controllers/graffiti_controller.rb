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
    graffito.upvotes.create(user: current_user)
    respond_with graffito
  end

  def create
    debugger
    graffito.user = current_user.graffiti.new(graffiti_params)
    # clean up file hash, set tempfile and uuid keys
    handle_files(graffito, graffiti_params)
    debugger
    if graffito.save
      ::Graffiti::ImageUploaderJob.perform_later graffito # active job with delayed job
      respond_with graffito
    else
      render :new
    end
  end
  
  private

  # iterate over params to access file path; clean up hash keys we don't need; 
  # move file to unique folder for upload to s3
  def handle_files(graffito, graffiti_params)
     graffiti_params[:images].each_with_index do |file, index|
      ext = File.extname(file.path)
      saved_file = graffito.images[index]
      saved_file.delete("original_filename")
      saved_file.delete("content_type")
      saved_file.delete("headers")
      saved_file["uuid"] = SecureRandom.uuid # each file has its own UUID to write to s3, along with a version name (original, small, thumb)
      saved_file["tempfile"] = "tmp/uploads/graffiti/#{saved_file["uuid"]}#{ext}"
      FileUtils.mv file.path, saved_file["tempfile"]
    end
  end

  def graffiti_params
    params.require(:graffiti).permit(:borough, :status, :incident_address, :latitude, :longitude, images: [])
  end

end