class GraffitiController < ApplicationController
  Dir['./model/*.rb'].each {|file| require file}

  def index
    debugger
    graffiti = Graffiti.new 
    @display = graffiti.get_graffiti
  end

  # def show
  #   @display
  # end

end
