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
  end

  def destroy
    if @playlist.skip(params[:id], current_user.account)
      render_empty
    else
      render json: { error: 'エラー' }, status: :unprocessable_entity # TODO
    end
  end

  private

  def set_playlist
    raise ActiveRecord::RecordNotFound unless [1, 2, 3].include?(params[:playlist_deck].to_i)

    @playlist = Playlist.new(params[:playlist_deck])
  end
end
