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

  def archive
    respond_with Graffiti.pluck(:images).flatten.compact
  end

  def s3_direct_post
    s3_direct_post = S3_BUCKET.presigned_post(key: "uploads/#{SecureRandom.uuid}/${filename}", success_action_status: '201', acl: 'public-read')
    host = URI.parse(s3_direct_post.url).host
    render json: {s3_direct_post: s3_direct_post, s3_direct_post_host: host}
  end

  def create
    if current_user.present?
      graffito = current_user.graffiti_through_uploads.new(graffiti_params)
    else
      graffito = Graffiti.new(graffiti_params)
    end
    graffito.images.uniq!
    if graffito.save
      ::Graffiti::ImageProcessorJob.perform_later graffito # active job with delayed job
      head :no_content
    end
  end
  
  private

  def graffiti_params
    params.require(:graffiti).permit(:borough, :status, :incident_address, :latitude, :longitude, images: [])
  end
end