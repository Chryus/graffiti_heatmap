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

  def gmaps_streetview_capture_dates
    capture_dates = params[:capture_dates]
    debugger
    capture_dates.each do |object|
      graffito = Graffiti.find(object[:id])
      incident_date = graffito.incident_date
      capture_date = object[:capture_date].gsub('-', '/')
      capture_date = DateTime.strptime(capture_date, '%Y/%m')

      if graffito.incident_date > capture_date
        graffito.destroy
      end
    end
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
      ::Graffiti::ImageProcessorJob.perform_now graffito.id # active job with delayed job
      render json: graffito 
    end
  end

  def delete_image
    # fetch graffito by its images json key value pair
    key_value_pair = '[{"filename":' + '"' + params[:filename] +'"' '}]'
    graffito = Graffiti.where('images @> ?', key_value_pair).first

    # find image 
    graffito.images.each_with_index do |image, index|
      if image['filename'] == params[:filename]
        # remove from s3
        s3_client.delete_object({bucket: ENV['S3_BUCKET'], key: image['original_key']})
        s3_client.delete_object({bucket: ENV['S3_BUCKET'], key: image['thumb_key']})
        graffito.images.delete_at(index)
      end
    end
    # update record
    if graffito.save
      # if no images remain, delete graffito record
      if graffito.images.size == 0
        graffito.destroy
      end
      respond_with current_user do |format|
        format.json { render json: {images: current_user.as_json[:graffiti_images]}, status: :ok }  
      end
    end
  end
  
  private

  def s3_client
    s3_client ||= Aws::S3::Client.new
  end

  def graffiti_params
    params.require(:graffiti).permit(:borough, :status, :incident_address, :latitude, :longitude, images: [])
  end
end