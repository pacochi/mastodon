# frozen_string_literal: true

class HomeController < ApplicationController
  include HomeConcern

  protected

  def appmode
    'default'
  end
end
