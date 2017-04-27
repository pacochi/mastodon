# frozen_string_literal: true

class Intent::StatusesController < HomeController
  def new
    index
    @intent = true
  end

  private :index
end
