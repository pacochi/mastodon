# frozen_string_literal: true

class FollowingAccountsController < ApplicationController
  include AccountControllerConcern
  include TimelineConcern

  before_action :set_initial_state_data, only: :index

  layout 'timeline'

  def index
  end
end
