# frozen_string_literal: true

class Api::V1::PlaylistsController < ApiController
  # before_action -> { doorkeeper_authorize! :write }
  # before_action :require_user!

  respond_to :json

  def create
    # params[:id]
    # params[:link]

    render json: {}
  end

  def show
    deck = params[:id]
    render json: {
      deck: {
        number: deck,
        now_playing: 'uuid',
        time_offset: 20,
        playlists: [
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
    render json: {}
  end

  private

end
