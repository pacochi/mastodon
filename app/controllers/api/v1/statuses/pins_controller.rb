# frozen_string_literal: true

class Api::V1::Statuses::PinsController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :write }
  before_action :require_user!
  before_action :set_status
  after_action :clear_cache

  respond_to :json

  def create
    StatusPin.create!(account: current_account, status: @status)
    render json: @status, serializer: REST::StatusSerializer
  end

  def destroy
    pin = StatusPin.find_by(account: current_account, status: @status)
    pin&.destroy!
    render json: @status, serializer: REST::StatusSerializer
  end

  private

  def set_status
    @status = Status.find(params[:status_id])
  end

  def clear_cache
    # キャッシュにstatus_pinsの情報も保存されているためクリアする
    Rails.cache.delete(@status.cache_key)
  end
end
