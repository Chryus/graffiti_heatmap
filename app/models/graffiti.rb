require 'debugger'
require 'open-uri'

class Graffiti < ActiveRecord::Base

  attr_accessible :get_graffiti, :incident_address, :x_coordinate, :y_coordinate

  geocoded_by :incident_address, :if => :incident_address_changed?
  after_validation :geocode

  def self.geocoded_graffiti
    geo_data = []
    Graffiti.by_location.each do |incident|
      geo_data << { lat:incident.x_coordinate, lng:incident.y_coordinate}
  end


  def get_graffiti
    data = open("http://data.cityofnewyork.us/resource/gpwd-npar.json")
    graffiti_parsed = JSON.parse(data.read)
    graffiti_parsed.each do |incident|
      incident.delete("created_date")
      incident.delete("bbl")
      incident.delete("city_council_district")
      incident.delete("closed_date")
      incident.delete("resolution_action")
      incident.delete("community_board")
      incident.delete("police_precinct")
      g = Graffiti.new(incident)
      g.save
    end
    graffiti_parsed
  end




end
