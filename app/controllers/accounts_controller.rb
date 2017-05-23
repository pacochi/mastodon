# frozen_string_literal: true

class AccountsController < ApplicationController
  include AccountControllerConcern

  STATUSES_PER_PAGE = 20

  def show
    respond_to do |format|
      format.html do
        @statuses = @account.statuses.permitted_for(@account, current_account).order('id desc')
        if params[:max_id].present? || params[:since_id].present?
          @statuses = @statuses.paginate_by_max_id(STATUSES_PER_PAGE, params[:max_id], params[:since_id])
        else
          @statuses = @statuses.page(params[:page]).per(STATUSES_PER_PAGE).without_count
        end
        @statuses_collection = cache_collection(@statuses, Status)
      end

      format.atom do
        @entries = @account.stream_entries.order('id desc').where(hidden: false).with_includes.paginate_by_max_id(STATUSES_PER_PAGE, params[:max_id], params[:since_id])
        render xml: AtomSerializer.render(AtomSerializer.new.feed(@account, @entries.to_a))
      end

      format.activitystreams2
    end
  end

  def media
    @statuses = @account.statuses.permitted_for(@account, current_account).order('id desc').paginate_by_max_id(20, params[:max_id], params[:since_id])
    status_ids = @statuses.joins(:media_attachments).distinct(:id).ids
    @statuses = @statuses.where(id: status_ids)
    @statuses = cache_collection(@statuses, Status)
  end

  private

  def set_account
    @account = Account.find_local!(params[:username])
  end
end
