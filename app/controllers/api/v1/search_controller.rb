# frozen_string_literal: true

class Api::V1::SearchController < ApiController
  respond_to :json

  def index
    @search = OpenStruct.new(SearchService.new.call(params[:q], 5, params[:resolve] == 'true', current_account))
  end

  def statuses
    @statuses = Status.search(params[:keyword]).to_a.select {|i| Status.exists?(i._source.id)} .map {|i| Status.find(i._source.id)}
    #@statuses = @statuses.paginate_by_max_id(limit_param(DEFAULT_STATUSES_LIMIT), params[:max_id], params[:since_id])
    #@statuses = @statuses.without_replies if params[:exclude_replies]
    #@statuses = cache_collection(@statuses, Status)
#
    #set_maps(@statuses)

    #next_path = api_v1_status_search_timeline_url(statuses_pagination_params(max_id: @statuses.last.id))    unless @statuses.empty?
    #prev_path = api_v1_status_search_timeline_url(statuses_pagination_params(since_id: @statuses.first.id)) unless @statuses.empty?
    #next_path = api_v1_status_search_timeline_url(statuses_pagination_params(max_id: 10))    unless @statuses.empty?
    #prev_path = api_v1_status_search_timeline_url(statuses_pagination_params(since_id: 1)) unless @statuses.empty?
#
    #set_pagination_headers(next_path, prev_path)
  end

  def statuses_pagination_params(core_params)
    params.permit(:limit, :only_media, :exclude_replies, :keyword).merge(core_params)
  end
end
