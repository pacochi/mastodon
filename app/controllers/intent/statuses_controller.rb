# frozen_string_literal: true

class Intent::StatusesController < ApplicationController
  def new
    redirect_to share_path(text: params[:text])
  end
end
