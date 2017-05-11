# frozen_string_literal: true

class Api::V1::SuggestedAccountsController < ApiController
  before_action -> { doorkeeper_authorize! :follow }
  before_action :require_user!

  respond_to :json

  def index
    @account = current_user.account
    @accounts = Account.all.paginate_by_max_id(limit_param(DEFAULT_ACCOUNTS_LIMIT), params[:max_id], params[:since_id])

    next_path = api_v1_suggested_accounts_url(pagination_params(max_id: @accounts.last.id))    if @accounts.size == limit_param(DEFAULT_ACCOUNTS_LIMIT)
    prev_path = api_v1_suggested_accounts_url(pagination_params(since_id: @accounts.first.id)) unless @accounts.empty?

    set_pagination_headers(next_path, prev_path)
  end

  private

  def pagination_params(core_params)
    params.permit(:limit).merge(core_params)
  end
end
