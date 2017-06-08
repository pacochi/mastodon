# frozen_string_literal: true

class Api::V1::DeckQueuesController < ApiController
  before_action -> { doorkeeper_authorize! :write }
  before_action :require_user!
  before_action :set_playlist

  respond_to :json

  def create
    if @playlist.add(params[:link], current_user.account)
      render_empty
    else
      render json: { error: 'エラー' }, status: :unprocessable_entity # TODO
    end
  rescue Mastodon::MusicSourceNotFoundError => _
    render json: { error: '無効なURL' }, status: :bad_request
  rescue Mastodon::PlayerControlLimitError => _
    render json: { error: '操作回数制限' }, status: :too_many_requests
  rescue Mastodon::PlaylistSizeOverError => _
    render json: { error: 'プレイリストのサイズ制限オーバー' }, status: :bad_request
  end

  def destroy
    if @playlist.skip(params[:id], current_user.account)
      render_empty
    else
      render json: { error: 'エラー' }, status: :unprocessable_entity # TODO
    end
  rescue Mastodon::PlayerControlLimitError => _
    render json: { error: '操作回数制限' }, status: :too_many_requests
  rescue Mastodon::PlaylistEmptyError => _
    render json: { error: 'プレイリストが空' }, status: :bad_request
  end

  private

  def set_playlist
    raise ActiveRecord::RecordNotFound unless [1, 2, 3].include?(params[:playlist_deck].to_i)

    @playlist = Playlist.new(params[:playlist_deck])
  end
end
