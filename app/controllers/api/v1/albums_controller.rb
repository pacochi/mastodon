# frozen_string_literal: true

class Api::V1::AlbumsController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write }, except: :show
  before_action :require_user!, except: :show

  respond_to :json

  def create
    attributes = {
      title: params.require(:title),
      description: params.require(:description),
      image: params.require(:image),
    }

    ApplicationRecord.transaction do
      status = Status.new(account: current_account, text: '', visibility: :unlisted)
      status.save! validate: false

      attributes.merge!(status: status)
      @album = Album.create!(attributes)

      status.update! text: album_url(@album)
    end
  end

  def update
    @album = Album.find(params.require(:id))
    @album.update! params.permit(:title, :description, :image)
  end

  def destroy
    Album.find(params.require(:id)).destroy!
    render_empty
  end

  def show
    @album = Album.find(params.require(:id))
  end
end
