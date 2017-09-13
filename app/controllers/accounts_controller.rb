# frozen_string_literal: true

class AccountsController < ApplicationController
  include AccountControllerConcern
  include SignatureVerification

  STATUSES_PER_PAGE = 20

  def show
    respond_to do |format|
      format.html do
        @pinned_statuses = []

        if current_account && @account.blocking?(current_account)
          @statuses = []
          return
        end

        @pinned_statuses     = cache_collection(statuses_from_pinned_status, Status) if show_pinned_statuses?
        @statuses            = filtered_statuses.where.not(id: statuses_from_pinned_status.map(&:id)).page(params[:page]).per(STATUSES_PER_PAGE).without_count
        @statuses_collection = cache_collection(@statuses, Status)
        @next_url            = next_url unless @statuses.empty?
      end

      format.atom do
        @entries = @account.stream_entries.where(hidden: false).with_includes.paginate_by_max_id(20, params[:max_id], params[:since_id])
        render xml: OStatus::AtomSerializer.render(OStatus::AtomSerializer.new.feed(@account, @entries.reject { |entry| entry.status.nil? }))
      end

      format.json do
        render json: @account, serializer: ActivityPub::ActorSerializer, adapter: ActivityPub::Adapter, content_type: 'application/activity+json'
      end
    end
  end

  private

  def show_pinned_statuses?
    [replies_requested?, media_requested?, params[:max_id].present?, params[:since_id].present?].none?
  end

  def filtered_statuses
    default_statuses.tap do |statuses|
      statuses.merge!(only_media_scope) if media_requested?
      statuses.merge!(no_replies_scope) unless replies_requested?
    end
  end

  def default_statuses
    @account.statuses.where(visibility: [:public, :unlisted]).published
  end

  def statuses_from_pinned_status
    @statuses_from_pinned_status ||= default_statuses
      .joins(:pinned_status)
      .merge(PinnedStatus.where(account: @account).recent)
  end

  def only_media_scope
    Status.where(id: account_media_status_ids)
  end

  def account_media_status_ids
    @account.media_attachments.attached.reorder(nil).select(:status_id).distinct
  end

  def no_replies_scope
    Status.without_replies
  end

  def set_account
    @account = Account.find_local!(params[:username])
  end

  def next_url
    if media_requested?
      short_account_media_url(@account, max_id: @statuses.last.id)
    elsif replies_requested?
      short_account_with_replies_url(@account, max_id: @statuses.last.id)
    else
      short_account_url(@account, max_id: @statuses.last.id)
    end
  end

  def media_requested?
    request.path.ends_with?('/media')
  end

  def replies_requested?
    request.path.ends_with?('/with_replies')
  end
end
