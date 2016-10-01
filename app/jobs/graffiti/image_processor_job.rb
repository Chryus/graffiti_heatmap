class Graffiti::ImageProcessorJob < ActiveJob::Base
  queue_as :graffiti_images

  def perform(graffito)
    graffito.images.each do |image|
      filename = image['filename']
      uri = image['uri']
      
      # Get The Temporary Upload
      temp_obj = S3_BUCKET.object(uri)

      # Assign A Local Temp File
      local_file = "#{cache_dir}/#{filename}"
      
      # Read In File From S3 To Local Path
      File.open(local_file, 'wb') do |file|
        temp_obj.read do |chunk|
          temp_obj.write(chunk)
        end
      end

      # Process
      original = process(local_file, filename, 640, 480, "original")
      thumb = process(local_file, filename, 90, 90, "thumb")
     
      # Assign perm S3 files
      perm_uri = uri.gsub(/[^\/]+$/, "original_#{filename}").gsub('uploads', 'processed')
      perm_uri2 = uri.gsub(/[^\/]+$/, "thumb_#{filename}").gsub('uploads', 'processed')

      # Now Write Back The Transformed Files
      perm_obj = S3_BUCKET.objects(perm_uri)
      perm_obj2 = S3_BUCKET.objects(perm_uri2)

      perm_obj.write(File.open(original))
      perm_obj2.write(File.open(thumb))
     
      rescue StandardError => exception
        # That's A Fail :(
      ensure
        # Delete The Original Files
        temp_obj.delete
        original.delete
        thumb.delete
      end
    end
  end

  def process(local_file, filename, width, height, image_type)
    # Assign new local temp file
    new_local_file "#{cache_dir}/#{image_type}_#{filename}"

    # Read original local file and resize it
    if image_type == 'thumb'
      img = Magick::Image::read(local_file).resize_to_fit(width, height)
    else
      img = Magick::Image::read(local_file).resize_to_fill(width, height)
    end
    
    # Set target
    target = Magick::Image.new(width, height) do
      if image_type == 'thumb'
        self.background_color = 'orange'
      else
        self.background_color = 'black'
      end
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

  def cache_dir
    @cache_dir ||= "#{Rails.root}/tmp/#{SecureRandom.uuid}"
  end
end
