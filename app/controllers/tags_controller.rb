# frozen_string_literal: true

class TagsController < ApplicationController
  layout 'public'

  STATUSES_PER_PAGE = 20

  def show
    @tag = Tag.find_by!(name: params[:id].downcase)
    @statuses = Status.as_tag_timeline(@tag, current_account, params[:local]).page(params[:page]).per(STATUSES_PER_PAGE).without_count
    @statuses_collection = cache_collection(@tag.nil? ? [] : @statuses, Status)
  end
end
