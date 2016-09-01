require "rails_helper"

RSpec.describe GraffitiController, :type => :controller do
  describe "GET #index" do
    # spec/requests/api/v1/messages_spec.rb
    it 'updates the upvotes of a particular graffito' do
      graffito = FactoryGirl.create(:graffito)
      upvote_count = graffito.upvotes.count    
      
      put "/graffiti/#{graffito.id}"

      # test for the 200 status-code
      expect(response).to be_success

      expect(json['upvotes']).to be > upvote_count
    end
  end
end