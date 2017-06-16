# frozen_string_literal: true

class Api::V1::Accounts::PinnedStatusesController < Api::BaseController
  before_action -> { doorkeeper_authorize! :read }
  before_action :set_account

  respond_to :json

  def index
    pinned_statuses = PinnedStatus.where(account: @account).recent
    paginated_pinned_statuses = pinned_statuses.paginate_by_max_id(limit_param(DEFAULT_STATUSES_LIMIT), params[:max_id], params[:since_id])

    statuses = Status.permitted_for(@account, current_account)
      .where(id: pinned_statuses.pluck(:status_id))
      .joins(:pinned_status)
      .merge(PinnedStatus.recent)

    @statuses = cache_collection(statuses, Status)
    set_maps(@statuses)

    next_path = api_v1_account_pinned_statuses_url(pagination_params(max_id: paginated_pinned_statuses.last.id))    if paginated_pinned_statuses.size == limit_param(DEFAULT_STATUSES_LIMIT)
    prev_path = api_v1_account_pinned_statuses_url(pagination_params(since_id: paginated_pinned_statuses.first.id)) unless paginated_pinned_statuses.empty?

    set_pagination_headers(next_path, prev_path)

    render 'api/v1/accounts/statuses/index'
  end

  private

  def pagination_params(core_params)
    params.permit(:limit).merge(core_params)
  end

  def set_account
    @account = Account.find(params[:account_id])
  end
end
