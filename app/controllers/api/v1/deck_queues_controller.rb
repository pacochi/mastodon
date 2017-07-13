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
    render json: { error: "１時間に楽曲を追加できる回数は#{@settings.max_add_count}回までです。"}, status: :too_many_requests
  rescue Mastodon::PlaylistSizeOverError => _
    render json: { error: 'プレイリストにこれ以上曲を追加できません。' }, status: :bad_request
  rescue Mastodon::RedisMaxRetryError => _
    render json: { error: '不明なエラーが発生しました。' }, status: :service_unavailable
  rescue Mastodon::MusicSourceForbidden => _
    render json: { error: 'この楽曲は外部への埋め込みが禁止されています。' }, status: :forbidden
  rescue Mastodon::PlaylistWriteProtectionError
    render json: { error: 'このプレイリストには動画を追加できません。' }, status: :bad_request
  end

  def destroy
    if @playlist.skip(params[:id], current_user.account)
      render_empty
    else
      render json: { error: '不明なエラーが発生しました。' }, status: :service_unavailable
    end
  rescue Mastodon::PlayerControlLimitError
    render json: { error: "１時間にスキップできる回数は#{@settings.max_skip_count}回までです。" }, status: :too_many_requests
  rescue Mastodon::PlayerControlSkipLimitTimeError
    render json: { error: "SKIPボタンは、楽曲が始まってから#{@settings.skip_limit_time}秒後に押せるようになります" }, status: :bad_request
  rescue Mastodon::PlaylistItemNotFoundError
    render json: { error: 'スキップに失敗しました。' }, status: :bad_request
  rescue Mastodon::RedisMaxRetryError
    render json: { error: '不明なエラーが発生しました。' }, status: :service_unavailable
  end

  private

  def set_playlist
    @playlist = Playlist.find_by!(deck: params[:playlist_deck])
  end

  def set_settings
    @settings = Setting.playlist
  end

end
