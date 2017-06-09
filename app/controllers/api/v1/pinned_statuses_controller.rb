# frozen_string_literal: true

class Api::V1::PinnedStatusesController < ApiController
  before_action -> { doorkeeper_authorize!(:write) }
  before_action :require_user!
  before_action :set_status

  respond_to :json

  def create
    @status.create_pinned_status!(account: current_account) unless @status.pinned_status
    render 'api/v1/statuses/show'
  end

  def destroy
    @status.pinned_status&.destroy!
    render_empty
  end

  private

  def set_status
    @status = pinnable_statuses.find(params[:status_id])
  end

  def pinnable_statuses
    Status.where(account: current_account)
  end
end
