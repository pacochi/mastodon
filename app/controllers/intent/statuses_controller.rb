# frozen_string_literal: true

class Intent::StatusesController < ApplicationController
  include TimelineConcern

  before_action :authenticate_user!
  before_action :set_initial_state_data, only: :new

  layout 'timeline'

  def new
  end

  def authenticate_user!
    redirect_to(find_redirect_path_from_request) unless user_signed_in?
  end
end
