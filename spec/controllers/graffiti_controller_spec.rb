require "rails_helper"

RSpec.describe GraffitiController, :type => :controller do
  describe "GET #upvote" do
    # spec/requests/api/v1/messages_spec.rb
    it 'increments the upvotes of a particular graffito' do
      @graffito = create(:graffiti)
      upvote_count = @graffito.upvotes.count    
      put :upvote, id: @graffito.id, format: 'json'
      # test for the 200 status-code
      expect(response).to be_success

      expect(@graffito.upvotes.count).to be > upvote_count
    end
  end
end