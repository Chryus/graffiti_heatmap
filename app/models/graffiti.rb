#require 'pry'
require 'open-uri'
require 'geocoder'
require "geocoder/railtie"
Geocoder::Railtie.insert

class Graffiti < ActiveRecord::Base
  geocoded_by :incident_address, :if => :incident_address_changed?
  after_validation :geocode          # auto-fetch coordinates
  belongs_to :user

  def self.geocode_graffiti
    geo_data = []
    self.by_location.each do |incident|
      if incident.latitude != nil
        geo_data << {:lat => incident.latitude, :lng => incident.longitude, :count => incident.count}
      end
    end
    geo_data
  end

  def self.by_location
    Graffiti.select("latitude, longitude, COUNT(*) as count").group("latitude, longitude")
  end

  def self.get_graffiti
    self.destroy_all
    data = open("https://data.cityofnewyork.us/resource/8ktu-ngtj.json")
    graffiti_parsed = JSON.parse(data.read)
    graffiti_parsed.each do |incident|
      next if incident["status"] == "Closed"
      next if incident["x_coordinate"] == nil
      incident.delete("x_coordinate")
      incident.delete("y_coordinate")
      incident.delete("created_date")
      incident.delete("bbl")
      incident.delete("city_council_district")
      incident.delete("closed_date")
      incident.delete("resolution_action")
      incident.delete("community_board")
      incident.delete("police_precinct")
      incident.update(:incident_address => add_city_state(incident["incident_address"], incident["borough"]))
      Graffiti.create(incident)
    end
    graffiti_parsed
  end

  def self.add_city_state address, borough
    address << ", " << borough << ", NY"
  end
end



