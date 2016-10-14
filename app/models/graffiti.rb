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

  scope :geocoded_hotspots, -> { where.not(latitude: nil, longitude: nil).where(hotspot: true, images: nil) }

  def as_json(options={})
    graffito = super(:only => [:id, :incident_address, :borough, :latitude, :longitude, :pov, :images])
    graffito[:upvotes] = upvotes.count
    graffito[:upvoted_by] = upvotes.pluck(:user_id)
    graffito
  end

  def self.heatmap_format
    graffiti = Graffiti.geocoded_hotspots.select("id, latitude, longitude, pov").map { |incident| 
      { id: incident.id, lat: incident.latitude, lng: incident.longitude, pov: incident.pov } 
    }
    graffiti[0...20]
  end

  def self.build_database
    self.geocoded_hotspots.destroy_all
    data = open("https://data.cityofnewyork.us/resource/8ktu-ngtj.json")
    graffiti = JSON.parse(data.read)
    graffiti.each do |incident|
      # skip ones without address
      next if incident["incident_address"] == nil
      # skip if incident address already exists in Rails
      next if Graffiti.where('incident_address LIKE ?', "%#{incident["incident_address"]}%").present?
      # if incident address occurs multiple times, flag as hotspot, otherwise skip if its not 'Open'
      if graffiti_hotspot?(incident, graffiti)
        incident['hotspot'] = true
      else
        next if incident["status"] != "Open"
      end
      # remove attrs we don't need in DB
      incident.delete("x_coordinate")
      incident.delete("y_coordinate")
      incident.delete("bbl")
      incident.delete("city_council_district")
      incident.delete("closed_date")
      incident.delete("resolution_action")
      incident.delete("community_board")
      incident.delete("police_precinct")
      # format address for geocoder
      incident.update(:incident_address => add_city_state(incident["incident_address"], incident["borough"]))
      # format as incident_date as datetime to compare with google maps streetview capture date
      incident['incident_date'] = format_raw_date(incident["created_date"])
      incident.delete("created_date")
      Graffiti.create(incident)
    end
    graffiti
  end

  def self.graffiti_hotspot?(incident, graffiti)
    graffiti.select {|g| g['incident_address'] == incident["incident_address"]}.count > 1
  end

  def self.format_raw_date raw_date
    date = raw_date.split("T").first
    date = date.gsub("-", "/")
    DateTime.strptime(date, '%Y/%m/%d')
  end

  def self.add_city_state address, borough
    address << ", " << borough << ", NY"
  end
end