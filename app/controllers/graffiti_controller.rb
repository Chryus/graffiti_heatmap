require 'time_difference'

class GraffitiController < ApplicationController

  def index
    hotspots = Graffiti.where(hotspot: true)
    single_occurrences = Graffiti.where(hotspot: false)
    heatmap_format = Graffiti.heatmap_format
    render json: {graffiti: hotspots + single_occurrences, heatmap: heatmap_format}
  end

  def show
    respond_with Graffiti.find(params[:id])
  end

  def upvote
    graffito = Graffiti.find(params[:id])
    graffito.upvotes.create(user: current_user)
    respond_with graffito
  end

  # logic to remove graffiti that proably aren't in google streetview
  def compare_google_image_dates_with_graffiti_dates
    capture_dates = params[:capture_dates]

    # iterate over capture dates and compare with incident dates
    capture_dates.each do |object|
      graffito = Graffiti.find_by(id: object[:id])
      next if graffito.nil?
      incident_date = graffito.incident_date
      # format capture date from google streetview to datetime
      capture_date = object[:capture_date].gsub('-', '/')
      # skip dates not in 2016/10 format
      next if (capture_date =~ /\d{4}\/\d{2}/) != 0
      capture_date = DateTime.strptime(capture_date, '%Y/%m')

      # grab diff between graffiti incident report date and streetview capture date
      diff = TimeDifference.between(graffito.incident_date, capture_date).in_days

      # if graffiti is not a hotspot & it was reported more than 180 days after streetview
      # capture date, or, more than 180 days before capture date, destroy record (it's probably not
      # in streetview)
      if !graffito.hotspot? && (graffito.incident_date > capture_date && diff > 180 ||
        graffito.incident_date < capture_date && diff > 180)
        graffito.destroy
      else
        graffito.update_attributes(streetview_capture_date: capture_date)
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

  def update
    graffito = Graffiti.find(params[:id])
    graffito.update_attributes(graffiti_params)
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
    params.require(:graffiti).permit(:borough, :status, :incident_address, :latitude, :longitude, :hotspot, pov: [:heading, :pitch], images: [])
  end
end
