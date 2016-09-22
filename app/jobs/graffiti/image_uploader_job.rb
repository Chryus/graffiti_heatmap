class Graffiti::ImageUploaderJob < ActiveJob::Base
  queue_as :graffiti_image

  def perform(graffito)
    @graffito = graffito
    FileUtils.mkdir_p(cache_dir, mode: 0777)
    graffito.images.each_with_index do |image, index|
      process(image, 640, 480, "original")
      process(image, 90, 90, "thumb")
      FileUtils.rm image["tempfile"] # remove tempfile from disk
      image.delete("tempfile") # delete tempfile pointer from db
      write_to_s3
      FileUtils.rm_r cache_dir # remove processed files from disk
    end
  end

  def process(image, width, height, name)
    Dir.glob(image["tempfile"]) do |file|
      img = Magick::Image::read(file).first.resize_to_fit!(width, height)
      target = Magick::Image.new(width, height) do
        self.background_color = 'orange'
      end
      target.composite(img, Magick::CenterGravity, Magick::AtopCompositeOp).write("#{cache_dir}/#{name}_#{image['uuid']}.jpg") do
        self.format = "JPEG"
        self.quality = 90
        self.compression = Magick::JPEGCompression
      end
    end
  end

  protected

  def cache_dir
    "tmp/uploads/graffiti/#{@graffito.id}/images/"
  end

  def s3_bucket
    "graffiti-image-uploads"
  end

  def s3_connection
    @s3_connection ||= ::Uploads::FogService.create
  end

  def write_to_s3
    Dir.glob("#{cache_dir}/*.*") do |file|
      destination = s3_connection.directories.get(s3_bucket)
      destination.files.create(key: file.split('/').last, body: File.read(file))
    end
  end
end
