# frozen_string_literal: true

class AlbumsController < ApplicationController
  include TimelineConcern

  before_action :authenticate_user!, except: :show
  before_action :set_initial_state_data

  layout 'timeline'

  def new
  end

  def show
    @album = Album.preload(status: :account).joins(status: :account).find_by!(
      id: params.require(:id),
      statuses: { accounts: { username: params.require(:account_username) } },
    )
  end

  private

  def authenticate_user!
    redirect_to about_path unless user_signed_in?
  end
end
