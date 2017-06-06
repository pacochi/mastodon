# frozen_string_literal: true

class Api::V1::PlaylistsController < ApiController
  before_action -> { doorkeeper_authorize! :write }
  before_action :require_user!

  respond_to :json

  def create
    item = QueueItem.create_from_link(params[:deck], params[:link], current_user.account)
    if item
      PushPlaylistWorker.perform_async(1, 'add', item.to_json)
      render_empty
    else
      render json: { error: 'エラー' }, status: :unprocessable_entity # TODO
    end
  end

  def show
    deck = params[:id]
    # TODO: mock
    render json: {
      deck: {
        number: deck,
        now_playing: 'uuid',
        time_offset: 20,
        queue: [
          {
            id: 'uuid',
            info: 'artist - music name',
            thumbnail_url: 'url',
            music_url: nil,
            video_url: 'url',
            duration: 360,
            link: 'url',
            source_type: 'pawoo',
          },
          {
            id: 'uuid2',
            info: 'artist2 - music name2',
            thumbnail_url: 'url',
            music_url: nil,
            video_url: 'url',
            duration: 300,
            link: 'url',
            source_type: 'youtube',
          },
        ],
      },
    }
  end

  def destroy
    deck = params[:id]
    if QueueItem.skip(deck, current_user.account)
      item = QueueItem.all(deck).first
      PushPlaylistWorker.perform_async(1, 'play', id: item.id)
      render_empty
    else
      render json: { error: 'エラー' }, status: :unprocessable_entity # TODO
    end
  end
end
