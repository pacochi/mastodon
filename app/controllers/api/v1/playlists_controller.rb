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
            info: 'artist - Deck' + deck.to_s + ' music name',
            thumbnail_url: 'https://s.booth.pm/01b481cf-ad99-42e7-91a6-1b2361828496/i/393675/b35b9e92-bb2c-4cba-8c3b-247f4f99a987.png',
            music_url: 'https://s.booth.pm/01b481cf-ad99-42e7-91a6-1b2361828496/s/393675/full/2a4d433e-fd15-4441-849e-ec8fd3fd4cf1.mp3',
            video_url: nil,
            duration: 360,
            link: 'https://potato4d.me/',
            source_type: 'pawoo',
          },
          {
            id: 'uuid',
            info: 'artist - Deck' + deck.to_s + ' music name',
            thumbnail_url: 'https://potato4d.me/res/images/icon.png',
            music_url: nil,
            video_url: 'http://localhost:3000/system/media_attachments/files/000/000/021/original/music-20170602-3003-1hxoozv.mp4?1496367745',
            duration: 360,
            link: 'https://potato4d.me/',
            source_type: 'pawoo',
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
