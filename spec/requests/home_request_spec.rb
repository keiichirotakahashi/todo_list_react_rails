require 'rails_helper'

RSpec.describe 'Home', type: :request do
  describe 'GET /' do
    it 'responds successfully' do
      get '/'
      expect(response).to have_http_status(200)
    end
  end
end