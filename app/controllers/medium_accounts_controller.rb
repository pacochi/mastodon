# frozen_string_literal: true

class MediumAccountsController < ApplicationController
  include AccountControllerConcern

  STATUSES_PER_PAGE = 20

  def index
    @statuses = @account.statuses.permitted_for(@account, current_account).reorder(id: :desc).joins(:media_attachments).distinct(:id)
    @statuses = @statuses.page(params[:page]).per(STATUSES_PER_PAGE).without_count
    @statuses_collection = cache_collection(@statuses, Status)
  end
end
