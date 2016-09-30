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
    debugger
    if current_user.present?
      graffito = current_user.graffiti_through_uploads.new(graffiti_params)
    else
      graffito = Graffiti.new(graffiti_params)
    end

    # clean up images
    handle_files(graffito)
    if graffito.save
      #::Graffiti::ImageUploaderJob.perform_later graffito # active job with delayed job
      return nil
    end
  end
  
  private

  #clean up images
  def handle_files(graffito)
    graffito.images.uniq!
    graffito.images.each_with_index do |uri, index|
      # we are adding hashes to images, if we get to a hash we're done
      next if uri.class == Hash
      filename = uri.split('/').last
      graffito.images << {uri: uri, filename: filename}
      graffito.images.delete(uri)
    end
  end

  def graffiti_params
    params.require(:graffiti).permit(:borough, :status, :incident_address, :latitude, :longitude, images: [])
  end
end