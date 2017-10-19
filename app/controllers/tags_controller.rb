# frozen_string_literal: true

class TagsController < ApplicationController
  include TimelineConcern

  before_action :set_initial_state_data, only: :show

  layout 'timeline'

  def show
    @tag_name = params[:id].downcase
    @tag = Tag.find_by(name: @tag_name)
  end
end
