require 'rmagick'

class Graffiti::ImageProcessorJob < ActiveJob::Base
  queue_as :graffiti_images

  rescue_from(ActiveRecord::RecordNotFound) do |exception|
    retry_job wait: 1.minutes, queue: :default
  end

  def perform(graffito)
    graffito = Graffiti.find(graffito)
    Delayed::Worker.logger.debug("Log Entry")
    images_json = []
    graffito.images.each_with_index do |uri, index| # uri = https://graffiti-image-uploads.s3.amazonaws.com/uploads/3e2e1981-bb7b-4cdb-a999-1946fcf38317/g3.jpg
      # Grab filename
      filename = uri.split('/').last # g3.jpg
      # Grab key for s3 storage
      object_key = uri.split('.com/').last # uploads/3e2e1981-bb7b-4cdb-a999-1946fcf38317/g3.jpg
      
      begin
        # Assign A Local Temp File
        local_file = "#{cache_dir}/#{filename}"

        # Create directory 
        FileUtils.mkdir(cache_dir) unless File.exist?(cache_dir)
        # Read In File From S3 To Local Path

        File.open(File.join(cache_dir, filename), 'wb') do |file|
          s3_client.get_object({bucket: ENV['S3_BUCKET'], key: object_key}) do |chunk|
            file.write(chunk)
          end
        end

        # Process images
        original = process(local_file, filename, 640, 480, "original")
        thumb = process(local_file, filename, 75, 75, "thumb")

        # Assign perm S3 file paths
        original_key = object_key.gsub(/[^\/]+$/, "original_#{filename}").gsub('uploads', 'processed')
        thumb_key = object_key.gsub(/[^\/]+$/, "thumb_#{filename}").gsub('uploads', 'processed')

        # Write images to s3
        write_to_s3(original, original_key)
        write_to_s3(thumb, thumb_key)
       
      rescue StandardError => exception
        # That's A Fail
      ensure
        # Delete original remote
        s3_client.delete_object({bucket: ENV['S3_BUCKET'], key: object_key})

        # Store new keys in json
        images_json << {original_key: original_key, thumb_key: thumb_key, filename: filename}

        # Delete local files
        FileUtils.rm_r(cache_dir)
      end
    end
    # update db with new s3 keys
    graffito.update_attributes(images: images_json)
  end

  def process(local_file, filename, width, height, image_type)
    # Assign new local temp file
    new_local_file = "#{cache_dir}/#{image_type}_#{filename}"

    # Read original local file and resize it
    img = if image_type == 'thumb'
            Magick::Image::read(local_file).first.resize_to_fill(width, height)
          else
            Magick::Image::read(local_file).first.resize_to_fit(width, height)
          end
    
    # Set target
    target = Magick::Image.new(width, height) do
      self.background_color = 'black' if image_type == 'original'
    end

    # Write original local file to target
    target.composite(img, Magick::CenterGravity, Magick::AtopCompositeOp).write(new_local_file) do
      self.format = "JPEG"
      self.quality = 90
      self.compression = Magick::JPEGCompression
    end
    new_local_file
  end

  protected

  def s3_client
    s3_client ||= Aws::S3::Client.new
  end

  def write_to_s3(processed, key)
    File.open(processed, 'rb') do |file|
      s3_client.put_object(bucket: ENV['S3_BUCKET'], key: key, body:file)
    end
  end

  def cache_dir
    @cache_dir ||= "#{Rails.root}/tmp/#{SecureRandom.uuid}"
  end
end
