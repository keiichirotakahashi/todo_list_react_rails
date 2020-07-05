class Api::V1::BaseController < ApplicationController
  before_action :authenticate_request

  private

  def authenticate_request
    unless user_signed_in?
      render json: 'Unauthorized request', status: :unauthorized and return
    end
  end
end
