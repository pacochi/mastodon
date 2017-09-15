# frozen_string_literal: true

class HomeController < ApplicationController
  include TimelineConcern

  layout 'timeline'

  before_action :set_initial_state_data, only: :index
  before_action :authenticate_user!, only: :index

  def index
  end

  def web
    # TODO: /webから始まるパスの場合、適切なパスにリダイレクトする
    redirect_to root_path
  end

  private

  def find_redirect_path_from_request
    return account_path(Account.first) if single_user_mode?

    case request.path
    when %r{\A/web/statuses/(?<status_id>\d+)\z}
      status_id = Regexp.last_match[:status_id]
      status = Status.where(visibility: [:public, :unlisted]).find(status_id)
      return short_account_status_path(status.account, status) if status.local?
    when %r{\A/web/accounts/(?<account_id>\d+)\z}
      account_id = Regexp.last_match[:account_id]
      account = Account.find(account_id)
      return short_account_path(account) if account.local?
    when %r{\A/web/timelines/tag/(?<tag>.+)\z}
      return tag_path(URI.decode(Regexp.last_match[:tag]))
    end
    about_path
  end
end
