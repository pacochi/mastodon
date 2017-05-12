# frozen_string_literal: true

class Api::V1::SuggestedAccountsController < ApiController
  before_action -> { doorkeeper_authorize! :follow }
  before_action :require_user!
  before_action :set_account

  respond_to :json

  def index
    limit = limit_param(DEFAULT_ACCOUNTS_LIMIT)

    @accounts = suggested_accounts.limit(limit).load

    media_attachments = published_attachemnts(@accounts.ids)
    @media_attachments_map = media_attachments.group_by(&:account_id)

    next_path = api_v1_suggested_accounts_url(exclude_ids: (excluded_ids + @accounts.ids).uniq.join(','))  if @accounts.size == limit
    prev_path = api_v1_suggested_accounts_url(exclude_ids: excluded_ids[0..-(limit + 1)]) if @accounts.present? && excluded_ids.present?
    set_pagination_headers(next_path, prev_path)
  end

  private

  def set_account
    @account = current_user.account
  end

  # Get top n images
  def published_attachemnts(account_ids)
    query = %{
      SELECT
        *
      FROM
        (
          SELECT
            ROW_NUMBER() OVER (PARTITION BY media_attachments.account_id ORDER BY media_attachments.id desc) AS row_number,
            media_attachments.*
          FROM
            media_attachments
          INNER JOIN statuses
            ON
              media_attachments.status_id = statuses.id AND
              statuses.sensitive = :sensitive AND
              visibility IN (:visibility)
          WHERE
            type = :type AND
            media_attachments.account_id IN (:account_ids)
        ) t1
      WHERE
        t1.row_number <= :limit;
    }

    MediaAttachment.find_by_sql([
      query,
      type: MediaAttachment.types['image'],
      visibility: Status.visibilities.values_at('public', 'unlisted'),
      sensitive: false,
      limit: 4, # maximum image length
      account_ids: account_ids
    ])
  end

  def suggested_accounts
    following = @account.following.ids
    muted_and_blocked = @account.excluded_from_timeline_account_ids

    SuggestedAccountQuery.exclude_ids([@account.id] + excluded_ids + following + muted_and_blocked).all
  end

  def excluded_ids
    params[:exclude_ids].to_s.split(',').map(&:to_i)
  end
end
