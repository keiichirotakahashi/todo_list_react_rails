require 'rails_helper'

RSpec.describe 'Home', type: :request do
  let(:user) { create(:user) }

  describe 'GET /' do
    subject do
      get '/'
      response
    end

    context 'as an authenticated user' do
      before { sign_in user }

      it { is_expected.to have_http_status 301 }
      it { is_expected.to redirect_to '/app' }
    end

    context 'as a guest' do
      it { is_expected.to have_http_status 301 }
      it { is_expected.to redirect_to '/app' }
    end
  end

  describe 'GET /app' do
    subject do
      get '/app'
      response
    end

    context 'as an authenticated user' do
      before { sign_in user }

      it { is_expected.to have_http_status 200 }
    end

    context 'as a guest' do
      it { is_expected.to have_http_status 302 }
      it { is_expected.to redirect_to '/login' }
    end
  end
end
