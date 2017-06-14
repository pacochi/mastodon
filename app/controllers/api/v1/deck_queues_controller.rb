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
      render json: { error: '不明なエラーが発生しました。' }, status: :service_unavailable
    end
  rescue Mastodon::MusicSourceNotFoundError => _
    render json: { error: '動画を追加できません。 （？）ボタンから、対応サービスを確認ください。' }, status: :bad_request
  rescue Mastodon::PlayerControlLimitError => _
    render json: { error: "１時間に楽曲を追加できる回数は#{Playlist::MAX_ADD_COUNT}回までです。"}, status: :too_many_requests
  rescue Mastodon::PlaylistSizeOverError => _
    render json: { error: 'プレイリストにこれ以上曲を追加できません。' }, status: :bad_request
  rescue Mastodon::RedisMaxRetryError => _
    render json: { error: '不明なエラーが発生しました。' }, status: :service_unavailable
  end

  def destroy
    if @playlist.skip(params[:id], current_user.account)
      render_empty
    else
      render json: { error: '不明なエラーが発生しました。' }, status: :service_unavailable
    end
  rescue Mastodon::PlayerControlLimitError => _
    render json: { error: "１時間にスキップできる回数は#{Playlist::MAX_SKIP_COUNT}回までです。" }, status: :too_many_requests
  rescue Mastodon::PlaylistEmptyError => _
    render json: { error: 'スキップに失敗しました。' }, status: :bad_request
  rescue Mastodon::RedisMaxRetryError => _
    render json: { error: '不明なエラーが発生しました。' }, status: :service_unavailable
  end

  private

  def set_playlist
    raise ActiveRecord::RecordNotFound unless [1, 2, 3].include?(params[:playlist_deck].to_i)

    @playlist = Playlist.new(params[:playlist_deck])
  end
end
