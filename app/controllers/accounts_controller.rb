# frozen_string_literal: true

class AccountsController < ApplicationController
  include AccountControllerConcern
  include SignatureVerification
  include TimelineConcern

  before_action :set_initial_state_data, only: :show

  layout 'timeline'

  def show
    respond_to do |format|
      format.html do
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
    permitted_statuses
      .joins(:pinned_status)
      .merge(PinnedStatus.where(account: @account).recent)
  end

  def permitted_statuses
    Status.where(account: @account).permitted_for(@account, current_account).published.recent
  end

  def set_account
    username, domain = (params[:username] || '').split('@')
    @account = Account.find_by!(username: username, domain: domain)
  end
end
