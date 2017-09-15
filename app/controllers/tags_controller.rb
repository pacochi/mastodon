# frozen_string_literal: true

class TagsController < ApplicationController
  layout 'public'

  STATUSES_PER_PAGE = 20

  def show
    @tag                 = Tag.find_by!(name: params[:id].downcase)
    @statuses            = Status.as_tag_timeline(@tag, current_account, params[:local]).page(params[:page]).per(STATUSES_PER_PAGE).without_count
    @statuses_collection = cache_collection(@tag.nil? ? [] : @statuses, Status)

    respond_to do |format|
      format.html

      format.json do
        render json: collection_presenter, serializer: ActivityPub::CollectionSerializer, adapter: ActivityPub::Adapter, content_type: 'application/activity+json'
      end
    end
  end

  private

  def collection_presenter
    ActivityPub::CollectionPresenter.new(
      id: tag_url(@tag),
      type: :ordered,
      size: @tag.statuses.count,
      items: @statuses.map { |s| ActivityPub::TagManager.instance.uri_for(s) }
    )
  end
end
