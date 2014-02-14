class PicturesController < ApplicationController
  Dir['./model/*.rb'].each {|file| require file}
  def index
  end
end
