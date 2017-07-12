# frozen_string_literal: true

module Admin
  class PlaylistsController < BaseController
    before_action :set_playlist, only: [:edit, :update, :destroy]

    def index
      @settings = Setting.playlist
      @playlists = Playlist.order(:deck)
    end

    def new
      @playlist = Playlist.new(deck_type: Playlist.deck_types[:normal])
    end

    def create
      @playlist = Playlist.new(playlist_params)

      if @playlist.save
        redirect_to admin_playlists_path, notice: 'チャンネルを追加しました'
      else
        render :new, status: :unprocessable_entity
      end
    end

    def edit; end

    def update
      if @playlist.update(playlist_params)
        redirect_to admin_playlists_path, notice: 'チャンネルを更新しました'
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def destroy
      if @playlist.destroy
        flash[:notice] = 'チャンネルを削除しました'
      else
        flash[:alert] = 'チャンネルの削除に失敗しました'
      end
      redirect_to admin_playlists_path
    end

    private

    def set_playlist
      @playlist = Playlist.find(params[:id])
    end

    def playlist_params
      params.require(:playlist).permit(:deck, :name, :deck_type, :write_protect)
    end
  end
end
