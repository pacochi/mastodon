# frozen_string_literal: true

class StatusesController < ApplicationController
  include Authorization
  include TimelineConcern

  layout 'timeline'

  before_action :set_account
  before_action :set_status
  before_action :check_account_suspension
  before_action :set_initial_state_data, only: :show

  def show
    respond_to do |format|
      format.html do
        @status_pagination = StatusPagination.new(@status, current_account)
        set_link_headers(@status_pagination.previous, @status_pagination.next)

        render 'stream_entries/show'
      end
    end
  end

  private

  def set_account
    @account = Account.find_local!(params[:account_username])
  end

  def set_link_headers(prev_status, next_status)
    links = []
    links.push([account_stream_entry_url(@account, @status.stream_entry, format: 'atom'), [%w(rel alternate), %w(type application/atom+xml)]])

    links.push([short_account_status_path(@account, prev_status), [%w(rel prev)]]) if prev_status
    links.push([short_account_status_path(@account, next_status), [%w(rel next)]]) if next_status

    response.headers['Link'] = LinkHeader.new(links)
  end

  def set_status
    @status       = @account.statuses.find(params[:id])
    @stream_entry = @status.stream_entry
    @type         = @stream_entry.activity_type.downcase

    authorize @status, :show?
  rescue Mastodon::NotPermittedError
    # Reraise in order to get a 404
    raise ActiveRecord::RecordNotFound
  end

  def check_account_suspension
    gone if @account.suspended?
  end
end
