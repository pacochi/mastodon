# frozen_string_literal: true

class AccountsController < ApplicationController
  include AccountControllerConcern

  STATUSES_PER_PAGE = 20

  def show
    respond_to do |format|
      format.html do
        # 固定されたトゥートは全件表示する。固定数が多いユーザーが現れたら考え直す。
        @statuses_from_pinned_status = cache_collection(statuses_from_pinned_status, Status)
        @statuses = permitted_statuses.where.not(id: @statuses_from_pinned_status.map(&:id)).page(params[:page]).per(STATUSES_PER_PAGE).without_count
        @statuses_collection = cache_collection(@statuses, Status)
      end

      format.atom do
        @entries = @account.stream_entries.where(hidden: false).with_includes.paginate_by_max_id(20, params[:max_id], params[:since_id])
        render xml: AtomSerializer.render(AtomSerializer.new.feed(@account, @entries.to_a))
      end

      format.activitystreams2
    end
  end

  private

  def statuses_from_pinned_status
    records = PinnedStatus.where(account: @account)

    permitted_statuses
      .where(id: records.pluck(:status_id))
      .joins(:pinned_status)
      .merge(PinnedStatus.recent)
  end

  def permitted_statuses
    Status.where(account: @account).permitted_for(@account, current_account).recent
  end

  def set_account
    @account = Account.find_local!(params[:username])
  end
end
