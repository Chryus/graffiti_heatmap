require "fog"
require "delegate"

module Uploads
  class FogService
    CREDENTIALS = {
      provider: "AWS",
      aws_access_key_id: ENV["S3_KEY"],
      aws_secret_access_key: ENV["S3_SECRET"],
      region: ENV['S3_REGION'],
      connection_options: {
        read_timeout: 60 * 2,
        write_timeout: 60 * 15,
        chunk_size: 512 * 1024
      }
    }

    def self.create
      FogDelegator.new(::Fog::Storage.new(CREDENTIALS))
    end

    class FogDelegator < SimpleDelegator; end
  end
end