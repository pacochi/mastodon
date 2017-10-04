# frozen_string_literal: true

class Api::V1::AlbumsController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write }, except: :show
  before_action :require_user!, except: :show

  respond_to :json

  def create
    attributes = {
      account: current_account,
      title: params.require(:title),
      text: params.require(:text),
      image: params.require(:image),
    }

    ApplicationRecord.transaction do
      status = Status.new(account: current_account, text: '', visibility: :unlisted)
      status.save! validate: false

      attributes.merge!(status: status)
      @album = Album.create!(attributes)

      status.update! text: short_account_album_url(current_account.username, @album)
    end
  end

  def update
    @album = Album.find_by!(id: params.require(:id), account: current_account)
    @album.update! params.permit(:title, :text, :image)
  end

  def destroy
    Album.find_by!(id: params.require(:id), account: current_account).destroy!
    render_empty
  end

  def show
    @album = Album.find(params.require(:id))
  end
end
