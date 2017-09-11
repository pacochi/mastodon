class Api::V1::Albums::TracksController < Api::BaseController
  before_action -> { doorkeeper_authorize! :write }, except: :index
  before_action :require_user!, except: :index

  respond_to :json

  def update
    if request.put?
      AlbumMusicAttachment.create!(
        album_id: params.require(:album_id),
        music_attachment_id: params.require(:id),
        position: position,
      )
    else
      AlbumMusicAttachment.find_by!(
        album_id: params.require(:album_id),
        music_attachment_id: params.require(:id),
      ).update! position: position
    end

    render_empty
  rescue Mastodon::TrackNotFoundError
    render json: { error: I18n.t('albums.tracks.not_found') }, status: :unprocessable_entity
  end

  def destroy
    AlbumMusicAttachment.find_by!(
      album_id: params.require(:album_id),
      music_attachment_id: params.require(:id),
    ).destroy!

    render_empty
  end

  def index
    since_id = params[:since_id]
    max_id = params[:max_id]
    ranging_ids = [since_id, max_id]

    @tracks = MusicAttachment
      .joins(:album_music_attachment)
      .merge(
         AlbumMusicAttachment
           .where(album_id: params.require(:album_id))
           .order(:position))
  end

  private

  def position
    previous_id = params[:previous_id]&.to_i
    next_id = params[:next_id]&.to_i
    positioning_ids = [previous_id, next_id].compact

    previous_position = AlbumMusicAttachment::MIN_POSITION
    next_position = AlbumMusicAttachment::MAX_POSITION

    positioning_attributes = AlbumMusicAttachment.where(
      music_attachment_id: positioning_ids,
      album_id: params.require(:album_id),
    ).pluck(:music_attachment_id, :position)

    if positioning_attributes.size < positioning_ids.size
      raise Mastodon::TrackNotFoundError
    end

    positioning_attributes.each do |attributes|
      case attributes[0]
      when previous_id
        previous_position = attributes[1]
      when next_id
        next_position = attributes[1]
      end
    end

    if next_position <= previous_position
      raise Mastodon::ValidationError, I18n.t('albums.tracks.invalid_range')
    end

    AlbumMusicAttachment.position_between(previous_position, next_position)
  end

  def range(lower, upper)
    previous_id = params[:previous_id]&.to_i
    next_id = params[:next_id]&.to_i
    positioning_ids = [previous_id, next_id].compact

    previous_position = AlbumMusicAttachment::MIN_POSITION
    next_position = AlbumMusicAttachment::MAX_POSITION

    positioning_attributes = AlbumMusicAttachment.where(
      music_attachment_id: positioning_ids,
      album_id: params.require(:album_id),
    ).pluck(:music_attachment_id, :position)

    if positioning_attributes.size < positioning_ids.size
      raise Mastodon::TrackNotFoundError
    end

    positioning_attributes.each do |attributes|
      case attributes[0]
      when previous_id
        previous_position = attributes[1]
      when next_id
        next_position = attributes[1]
      end
    end
  end
end
