# frozen_string_literal: true

class Api::V1::SuggestedAccountsController < ApiController
  before_action -> { doorkeeper_authorize! :follow }
  before_action :require_user!

  respond_to :json

  def index
    limit = limit_param(DEFAULT_ACCOUNTS_LIMIT)
    limit = 20

    @accounts = suggested_accounts(current_user.account).limit(limit)

    media_attachments = popular_media_attachments(@accounts)
    @media_attachments_map = media_attachments.group_by(&:account_id)

    next_path = api_v1_suggested_accounts_url(exclude_ids: (excluded_ids + @accounts.ids).uniq.join(','))  if @accounts.size == limit
    prev_path = api_v1_suggested_accounts_url(exclude_ids: excluded_ids[0..-(limit + 1)]) if @accounts.present? && excluded_ids.present?
    set_pagination_headers(next_path, prev_path)
  end

  private

  # Get top n images
  def popular_media_attachments(accounts)
    media_attachments_ids = accounts.map { |account|
      Rails.cache.fetch("suggested_account:published_attachments:#{account.id}") do
        account.media_attachments.joins(:status).where(statuses: { sensitive: false, visibility: [:public, :unlisted] }).order(Status.arel_table[:favourites_count].desc).first(3).map(&:id)
      end
    }.flatten

    MediaAttachment.where(id: media_attachments_ids)
  end

  def suggested_accounts(account)
    following = account.following.ids
    muted_and_blocked = account.excluded_from_timeline_account_ids

    SuggestedAccountQuery.exclude_ids([account.id] + excluded_ids + following + muted_and_blocked).all
  end

  def excluded_ids
    params[:exclude_ids].to_s.split(',').map(&:to_i)
  end
end
