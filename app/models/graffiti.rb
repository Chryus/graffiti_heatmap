require 'debugger'
require 'open-uri'

class Graffiti < ActiveRecord::Base

  attr_reader :get_graffiti

  def get_graffiti
    download = open("http://data.cityofnewyork.us/resource/gpwd-npar.json")
    doc = JSON.parse(download.read)
    return doc
  end


end
