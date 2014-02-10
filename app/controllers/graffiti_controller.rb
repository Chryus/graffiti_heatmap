class GraffitiController < ApplicationController
  Dir['./model/*.rb'].each {|file| require file}

  def index
    @graffiti = Graffiti.all
  end

  # def show
  #   @display
  # end

end
