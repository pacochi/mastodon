# frozen_string_literal: true

class Intent::StatusesController < ApplicationController
  include HomeConcern

  def new
    index
  end

  private :index

  protected

  def appmode
    'intent'
  end
end
