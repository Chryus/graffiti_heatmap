require 'open-uri'
require 'geocoder'
require "geocoder/railtie"
Geocoder::Railtie.insert

class Graffiti < ActiveRecord::Base
  geocoded_by :incident_address, :if => :incident_address_changed?
  after_validation :geocode  # auto-fetch coordinates
  belongs_to :user
  has_many :comments
  has_many :upvotes
  has_many :users_through_upvotes, through: :upvotes,
                                  :class_name => 'User', 
                                  :foreign_key => 'user_id',
                                  :source => :user

  def as_json(options={})
    graffito = super(:only => [:id, :incident_address, :borough, :latitude, :longitude, :images])
    graffito[:upvotes] = upvotes.count
    graffito[:upvoted_by] = upvotes.pluck(:user_id)
    graffito
  end

  def self.heatmap_format
    Graffiti.where.not(incident_address: '').select("latitude, longitude").map { |incident| { :lat => incident.latitude, :lng => incident.longitude } }
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