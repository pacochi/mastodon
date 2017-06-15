# frozen_string_literal: true

class Api::V1::AccountsController < Api::BaseController
  before_action -> { doorkeeper_authorize! :read }, except: [:follow, :unfollow, :block, :unblock, :mute, :unmute]
  before_action -> { doorkeeper_authorize! :follow }, only: [:follow, :unfollow, :block, :unblock, :mute, :unmute]
  before_action :require_user!, except: [:show]
  before_action :set_account

  respond_to :json

  def show; end

<<<<<<< HEAD
  def verify_credentials
    @account = current_user.account
    render :show
  end

  def update_credentials
    current_account.update!(account_params)
    @account = current_account
    render :show
  end

  def following
    @accounts = Account.includes(:passive_relationships)
                       .references(:passive_relationships)
                       .merge(Follow.where(account: @account)
                                    .paginate_by_max_id(limit_param(DEFAULT_ACCOUNTS_LIMIT), params[:max_id], params[:since_id]))
                       .to_a

    next_path = following_api_v1_account_url(pagination_params(max_id: @accounts.last.passive_relationships.first.id))     if @accounts.size == limit_param(DEFAULT_ACCOUNTS_LIMIT)
    prev_path = following_api_v1_account_url(pagination_params(since_id: @accounts.first.passive_relationships.first.id)) unless @accounts.empty?

    set_pagination_headers(next_path, prev_path)

    render :index
  end

  def followers
    @accounts = Account.includes(:active_relationships)
                       .references(:active_relationships)
                       .merge(Follow.where(target_account: @account)
                                    .paginate_by_max_id(limit_param(DEFAULT_ACCOUNTS_LIMIT),
                                                        params[:max_id],
                                                        params[:since_id]))
                       .to_a

    next_path = followers_api_v1_account_url(pagination_params(max_id: @accounts.last.active_relationships.first.id))     if @accounts.size == limit_param(DEFAULT_ACCOUNTS_LIMIT)
    prev_path = followers_api_v1_account_url(pagination_params(since_id: @accounts.first.active_relationships.first.id)) unless @accounts.empty?

    set_pagination_headers(next_path, prev_path)

    render :index
  end

  def statuses
    @statuses = @account.statuses.permitted_for(@account, current_account).paginate_by_max_id(limit_param(DEFAULT_STATUSES_LIMIT), params[:max_id], params[:since_id])
    @statuses = @statuses.where(id: MediaAttachment.where(account: @account).where.not(status_id: nil).reorder('').select('distinct status_id')) if params[:only_media]
    @statuses = @statuses.without_replies if params[:exclude_replies]
    @statuses = cache_collection(@statuses, Status)

    set_maps(@statuses)

    next_path = statuses_api_v1_account_url(statuses_pagination_params(max_id: @statuses.last.id))    if @statuses.size == limit_param(DEFAULT_STATUSES_LIMIT)
    prev_path = statuses_api_v1_account_url(statuses_pagination_params(since_id: @statuses.first.id)) unless @statuses.empty?

    set_pagination_headers(next_path, prev_path)
  end

  def pinned_statuses
    pinned_statuses = PinnedStatus.where(account: @account).recent
    paginated_pinned_statuses = pinned_statuses.paginate_by_max_id(limit_param(DEFAULT_STATUSES_LIMIT), params[:max_id], params[:since_id])

    statuses = Status.permitted_for(@account, current_account)
      .where(id: pinned_statuses.pluck(:status_id))
      .joins(:pinned_status)
      .merge(PinnedStatus.recent)

    @statuses = cache_collection(statuses, Status)
    set_maps(@statuses)

    next_path = pinned_statuses_api_v1_account_url(statuses_pagination_params(max_id: paginated_pinned_statuses.last.id))    if paginated_pinned_statuses.size == limit_param(DEFAULT_STATUSES_LIMIT)
    prev_path = pinned_statuses_api_v1_account_url(statuses_pagination_params(since_id: paginated_pinned_statuses.first.id)) unless paginated_pinned_statuses.empty?

    set_pagination_headers(next_path, prev_path)

    render :statuses
  end

=======
>>>>>>> 947887f261f74f84312327a5265553e8f16655fe
  def follow
    FollowService.new.call(current_user.account, @account.acct)
    set_relationship
    render :relationship
  end

  def block
    BlockService.new.call(current_user.account, @account)

    @following       = { @account.id => false }
    @followed_by     = { @account.id => false }
    @blocking        = { @account.id => true }
    @requested       = { @account.id => false }
    @muting          = { @account.id => current_account.muting?(@account.id) }
    @domain_blocking = { @account.id => current_account.domain_blocking?(@account.domain) }

    render :relationship
  end

  def mute
    MuteService.new.call(current_user.account, @account)
    set_relationship
    render :relationship
  end

  def unfollow
    UnfollowService.new.call(current_user.account, @account)
    set_relationship
    render :relationship
  end

  def unblock
    UnblockService.new.call(current_user.account, @account)
    set_relationship
    render :relationship
  end

  def unmute
    UnmuteService.new.call(current_user.account, @account)
    set_relationship
    render :relationship
  end

  private

  def set_account
    @account = Account.find(params[:id])
  end

  def set_relationship
    @following       = Account.following_map([@account.id], current_user.account_id)
    @followed_by     = Account.followed_by_map([@account.id], current_user.account_id)
    @blocking        = Account.blocking_map([@account.id], current_user.account_id)
    @muting          = Account.muting_map([@account.id], current_user.account_id)
    @requested       = Account.requested_map([@account.id], current_user.account_id)
    @domain_blocking = Account.domain_blocking_map([@account.id], current_user.account_id)
  end
end
