# frozen_string_literal: true

class Api::V1::DeckQueuesController < ApiController
  before_action -> { doorkeeper_authorize! :write }
  before_action :require_user!
  before_action :check_deck

  respond_to :json

  def create
    deck = params[:playlist_deck]
    item = QueueItem.create_from_link(deck, params[:link], current_user.account)
    if item
      PushPlaylistWorker.perform_async(deck, 'add', item.to_json)
      render_empty
    else
      render json: { error: 'エラー' }, status: :unprocessable_entity # TODO
    end
  end

  def destroy
    deck = params[:playlist_deck]
    if QueueItem.skip(deck, params[:id], current_user.account)
      item = QueueItem.all(deck).first
      PushPlaylistWorker.perform_async(deck, 'play', id: item.id)
      render_empty
    else
      render json: { error: 'エラー' }, status: :unprocessable_entity # TODO
    end
  end

  private

  def check_deck
    raise ActiveRecord::RecordNotFound unless [1, 2, 3].include?(params[:deck].to_i)
  end
end
