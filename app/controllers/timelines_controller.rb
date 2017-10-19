# frozen_string_literal: true

class TimelinesController < ApplicationController
  include TimelineConcern

  layout 'timeline'

  before_action :set_initial_state_data, only: :index
  before_action :set_instance_presenter, only: :index

  def index
    render 'home/index'
  end

  def set_instance_presenter
    @instance_presenter = InstancePresenter.new
  end
end
