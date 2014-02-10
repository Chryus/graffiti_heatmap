class GraffitiController < ApplicationController
  def index
    @graffiti = Graffiti.all
  end
end
