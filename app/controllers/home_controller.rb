# frozen_string_literal: true

class HomeController < ApplicationController
  include HomeConcern

  def index
    @appmode = 'default'
    super
  end
end
