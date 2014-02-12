require 'debugger'
require 'open-uri'

class Graffiti < ActiveRecord::Base

  attr_accessible :status, :y_coordinate, :x_coordinate, :borough, :incident_address, :latitude, :longitude

  geocoded_by :incident_address, :if => :incident_address_changed?
  after_validation :geocode

  def self.geocode_graffiti
    geo_data = []
    self.by_location.each do |incident|
      geo_data << {:lat => incident.latitude, :lng => incident.longitude, :count => incident.count}
    end
    geo_data
  end

  def self.by_location
    Graffiti.all(:select => "latitude, longitude, COUNT(*) as count", :group => "latitude, longitude")
  end

  def self.get_graffiti
    data = open("http://data.cityofnewyork.us/resource/gpwd-npar.json")
    graffiti_parsed = JSON.parse(data.read)
    graffiti_parsed.each do |incident|
      debugger
      incident.delete("created_date")
      incident.delete("bbl")
      incident.delete("city_council_district")
      incident.delete("closed_date")
      incident.delete("resolution_action")
      incident.delete("community_board")
      incident.delete("police_precinct")
      incident.update(:incident_address => add_city_state(incident["incident_address"], incident["borough"]))
      g = Graffiti.new(incident)
      debugger
      g.save
    end
    graffiti_parsed
  end

end

def add_city_state(address, borough)
  address << ", " << borough << ", NY"
end

