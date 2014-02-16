require 'debugger'
require 'open-uri'

class Graffiti < ActiveRecord::Base

  attr_accessible :status, :borough, :incident_address, :latitude, :longitude

  geocoded_by :incident_address, :if => :incident_address_changed?
  after_validation :geocode

  def self.geocode_graffiti
    geo_data = []
    self.by_location.each do |incident|
      if incident.latitude != nil
        geo_data << {:lat => incident.latitude, :lng => incident.longitude, :count => incident.count}
      end
    end
    geo_data
  end

  def self.correct_empty_latitudes
    self.all.reject{|g| g.latitude == nil}
  end

  def self.by_location
    Graffiti.all(:select => "latitude, longitude, COUNT(*) as count", :group => "latitude, longitude")
  end

  def self.make_graffiti
    empty_database
    data = open("http://data.cityofnewyork.us/resource/gpwd-npar.json")
    graffiti_parsed = JSON.parse(data.read)
    graffiti_parsed.each do |incident|
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
      g = Graffiti.new(incident)
      g.save
    end
    graffiti_parsed
  end

  def self.add_city_state address, borough
    address << ", " << borough << ", NY"
  end

  def self.empty_database
    self.all.each {|x| x.destroy}
  end


end



