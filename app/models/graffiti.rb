require 'debugger'
require 'open-uri'

class Graffiti < ActiveRecord::Base

  attr_reader :get_graffiti

  def get_graffiti
    data = open("http://data.cityofnewyork.us/resource/gpwd-npar.json")
    parsed = JSON.parse(data.read)
    parsed.each do |graffiti_report|
      graffiti_report.delete("created_date")
      graffiti_report.delete("bbl")
      graffiti_report.delete("city_council_district")
      graffiti_report.delete("closed_date")
      graffiti_report.delete("resolution_action")
      graffiti_report.delete("community_board")
      graffiti_report.delete("police_precinct")
      g = Graffiti.new(graffiti_report)
      g.save
    end
    parsed
  end


end
