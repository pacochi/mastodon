# frozen_string_literal: true

module Admin
  class StatusesController < BaseController
    include Authorization

    helper_method :target_path

    before_action :set_account
    before_action :set_status, only: [:update, :destroy]

    PAR_PAGE = 20

    def index
      @statuses = target_statuses.preload(:media_attachments, :mentions, :pixiv_cards).page(params[:page]).per(PAR_PAGE)
    end

    def update
      @status.update(status_params)
      redirect_to redirect_path
    end

    def destroy
      authorize @status, :destroy?
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

    def target_statuses
      @account.statuses
    end

    def current_page_params
      page = (target_statuses.where(Status.arel_table[:id].gt(@status.id)).size.to_f / PAR_PAGE).ceil
      if page > 1
        { page: page }
      else
        {}
      end
    end

    def redirect_path
      admin_account_statuses_path(@account.id, current_page_params)
    end

    def target_path(*args)
      admin_account_status_path(*args)
    end
  end
end
