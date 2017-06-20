# frozen_string_literal: true

module Admin
  class StatusesController < BaseController
    before_action :set_account
    before_action :set_status, only: [:update, :destroy]

    PAGE_PAR_NUM = 20

    def index
      @statuses = @account.statuses.page(params[:page]).per(PAGE_PAR_NUM).preload(:media_attachments, :pixiv_cards)
    end

    def update
      @status.update(status_params)
      page = (@account.statuses.where(Status.arel_table[:id].gt(@status.id)).size.to_f / PAGE_PAR_NUM).ceil
      redirect_to admin_account_statuses_path(@account.id, page: page)
    end

    def destroy
      RemovalWorker.perform_async(@status.id)
      render json: @status
    end

    private

    def status_params
      params.require(:status).permit(:sensitive)
    end

    def set_status
      @status = @account.statuses.find(params[:id])
    end

    def set_account
      @account = Account.find(params[:account_id])
    end
  end
end
