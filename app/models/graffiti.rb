require 'open-uri'

class Graffiti < ActiveRecord::Base
  belongs_to :user
  has_many :comments
  has_many :upvotes, dependent: :destroy
  has_many :users_through_upvotes, through: :upvotes,
                                  :class_name => 'User',
                                  :foreign_key => 'user_id',
                                  :source => :user

  scope :hotspots, -> { where(hotspot: true, images: nil) }

  def as_json(options={})
    graffito = super(:only => [:id, :address, :borough, :latitude, :longitude, :pov, :images])
    graffito[:upvotes] = upvotes.count
    graffito[:upvoted_by] = upvotes.pluck(:user_id)
    graffito
  end

  def self.heatmap_format
    graffiti = Graffiti.select("id, latitude, longitude, pov").map { |incident|
      { id: incident.id, lat: incident.latitude, lng: incident.longitude, pov: incident.pov }
    }
    graffiti
  end

  def self.build_database
    self.destroy_all
    data = open("https://data.cityofnewyork.us/resource/gpwd-npar.json")
    graffiti = JSON.parse(data.read)
    graffiti.each do |incident|
      # skip ones without address
      next if incident["latitude"] == nil
      next if incident["longitude"] == nil

      filtered_hash = incident.slice("latitude", "longitude", "borough", "status")
      # if incident address occurs multiple times, flag as hotspot, otherwise skip if it's not 'Open'
      # filter keys for DB
      if graffiti_hotspot?(incident, graffiti)
        filtered_hash['hotspot'] = true
      else
        #next if incident["status"] != "Open"
      end
      # format address
      filtered_hash["address"] = add_city_state(incident["incident_address"], incident["borough"])
      # format as incident_date as datetime to compare with google maps streetview capture date
      filtered_hash["incident_date"] = format_raw_date(incident["created_date"])
      Graffiti.create(filtered_hash)
    end
  end

  def self.graffiti_hotspot?(incident, graffiti)
    graffiti.select do |g|
      g["incident_address"] == incident["incident_address"] || g["latitude"] == incident["latitude"] &&
        g["longitude"] == incident["longitude"]
    end.count > 1
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
