# frozen_string_literal: true

class TagsController < ApplicationController
  include TimelineConcern

  before_action :set_initial_state_data, only: :show

  layout 'timeline'

  def show
    @tag = Tag.find_by!(name: params[:id].downcase)
  end
end
