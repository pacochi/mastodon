# frozen_string_literal: true

class Intent::StatusesController < ApplicationController
  include TimelineConcern

  before_action :authenticate_user!
  before_action :set_initial_state_data, only: :new

  layout 'timeline'

  def new
  end
end
