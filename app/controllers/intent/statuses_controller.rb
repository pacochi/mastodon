# frozen_string_literal: true

class Intent::StatusesController < ApplicationController
  include HomeConcern

  def new
    index
    @appmode = 'intent'
  end

  private :index
end
