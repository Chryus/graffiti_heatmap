# This will guess the User class
FactoryGirl.define do
  factory :graffiti do
    incident_address "80 Dekalb Ave"
    borough  "Brooklyn"
    latitude "40.1"
    longitude "42.1"
    images ['foopathtos3', 'barpathtos3', 'foopathtos3']
  end
end