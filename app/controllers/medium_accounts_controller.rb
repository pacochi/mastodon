# frozen_string_literal: true

class MediumAccountsController < ApplicationController
  include AccountControllerConcern

  STATUSES_PER_PAGE = 20

  def index
    @statuses = @account.statuses.permitted_for(@account, current_account).order('id desc').joins(:media_attachments).distinct(:id)
    if params[:max_id].present? || params[:since_id].present?
      @statuses = @statuses.paginate_by_max_id(STATUSES_PER_PAGE, params[:max_id], params[:since_id])
    else
      @statuses = @statuses.page(params[:page]).per(STATUSES_PER_PAGE).without_count
    end

    @statuses_collection = cache_collection(@statuses, Status)
  end
end
