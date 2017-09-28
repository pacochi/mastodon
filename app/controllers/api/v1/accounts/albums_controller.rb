# frozen_string_literal: true

class Api::V1::Accounts::AlbumsController < Api::BaseController
  after_action :insert_pagination_headers

  respond_to :json

  def index
    @albums = account_albums
  end

  private

  def account_albums
    Album.where(account_id: params.require(:account_id))
         .paginate_by_max_id(
           limit_param(DEFAULT_ALBUMS_LIMIT),
           params[:max_id],
           params[:since_id]
         )
  end

  def pagination_params(core_params)
    params.permit(:limit).merge(core_params)
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def next_path
    if records_continue?
      api_v1_account_albums_url pagination_params(max_id: pagination_max_id)
    end
  end

  def prev_path
    unless @albums.empty?
      api_v1_account_albums_url pagination_params(since_id: pagination_since_id)
    end
  end

  def records_continue?
    @albums.size == limit_param(DEFAULT_ALBUMS_LIMIT)
  end

  def pagination_max_id
    @albums.last.id
  end

  def pagination_since_id
    @albums.first.id
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end
end
