# frozen_string_literal: true

class TimelinesController < ApplicationController
  include TimelineConcern

  layout 'timeline'

  before_action :set_initial_state_data, only: :index

  def index
    render 'home/index'
  end
end
