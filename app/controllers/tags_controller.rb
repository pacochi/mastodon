# frozen_string_literal: true

class TagsController < ApplicationController
  layout 'public'

  STATUSES_PER_PAGE = 20

  def show
    @tag = Tag.find_by!(name: params[:id].downcase)
    @statuses = Status.as_tag_timeline(@tag, current_account, params[:local])
    if params[:max_id].present? || params[:since_id].present?
      @statuses = @statuses.paginate_by_max_id(STATUSES_PER_PAGE, params[:max_id], params[:since_id])
    else
      @statuses = @statuses.page(params[:page]).per(STATUSES_PER_PAGE).without_count
    end
    @statuses_collection = cache_collection(@tag.nil? ? [] : @statuses, Status)
  end
end
