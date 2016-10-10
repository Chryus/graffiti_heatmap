require 'open-uri'
require 'geocoder'
require "geocoder/railtie"
Geocoder::Railtie.insert

class Graffiti < ActiveRecord::Base
  geocoded_by :incident_address
  after_validation :geocode, if: ->(obj){ obj.incident_address.present? and :incident_address_changed? }  # auto-fetch coordinates with geocoder gem
  belongs_to :user
  has_many :comments
  has_many :upvotes, dependent: :destroy
  has_many :users_through_upvotes, through: :upvotes,
                                  :class_name => 'User', 
                                  :foreign_key => 'user_id',
                                  :source => :user

  scope :is_geocoded?, -> { where.not(latitude: nil, longitude: nil) }

  def as_json(options={})
    graffito = super(:only => [:id, :incident_address, :borough, :latitude, :longitude, :images])
    graffito[:upvotes] = upvotes.count
    graffito[:upvoted_by] = upvotes.pluck(:user_id)
    graffito
  end

  def self.heatmap_format
    Graffiti.where.not(latitude: nil).select("latitude, longitude").map { |incident| { :lat => incident.latitude, :lng => incident.longitude } }
  end

  def self.get_graffiti
    self.is_geocoded?.destroy_all
    data = open("https://data.cityofnewyork.us/resource/8ktu-ngtj.json")
    graffiti_parsed = JSON.parse(data.read)
    graffiti_parsed.each do |incident|
      next if incident["status"] == "Closed"
      next if incident["x_coordinate"] == nil
      incident.delete("x_coordinate")
      incident.delete("y_coordinate")
      incident.delete("bbl")
      incident.delete("city_council_district")
      incident.delete("closed_date")
      incident.delete("resolution_action")
      incident.delete("community_board")
      incident.delete("police_precinct")
      incident.update(:incident_address => add_city_state(incident["incident_address"], incident["borough"]))
      incident['incident_date'] = format_raw_date(incident["created_date"])
      incident.delete("created_date")
      Graffiti.create(incident)
    end
    graffiti_parsed
  end

  def self.format_raw_date raw_date
    date = raw_date.split("T").first
    date = date.gsub("-", "/")
    DateTime.strptime(date, '%Y/%m/%d')
  end

  def self.add_city_state address, borough
    address << ", " << borough << ", NY"
  end

  # if incident report was made after the gmaps streetview capture date don't save bc graffiti can't be there
  # def compare_gmaps_with_incident_date
  #   source = File.read(Rails.root.join('app/assets/javascripts/server_side/gmaps_streetview_service.js.erb'))
  #   context = ExecJS.compile(source)
  #   lat = self.latitude
  #   lng = self.longitude
  #   capture_date = context.call("streetviewImageCaptureDate", lat, lng)
  #   capture_date = DateTime.strptime(date, '%Y/%m/%d')
    
  #   self.incident_date > capture_date ? false : true
  # end
end