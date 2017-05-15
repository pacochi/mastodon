# frozen_string_literal: true

class Api::V1::SearchController < ApiController
  respond_to :json

  def index
    @search = OpenStruct.new(SearchService.new.call(params[:q], 5, params[:resolve] == 'true', current_account))
  end

  def statuses
    keyword = params[:keyword]
    current_page = params[:page].to_i
    p current_page
    @statuses = Status.search(keyword)
                      .page(current_page).per(limit_param(DEFAULT_STATUSES_LIMIT)).to_a
                      .select {|i| Status.exists?(i._source.id)} .map {|i| Status.find(i._source.id)}
    #@statuses = @statuses.paginate_by_max_id(limit_param(DEFAULT_STATUSES_LIMIT), params[:max_id], params[:since_id])
    #@statuses = @statuses.without_replies if params[:exclude_replies]
    #@statuses = cache_collection(@statuses, Status)
#
    #set_maps(@statuses)
  end

  def statuses_pagination_params(core_params)
    params.permit(:limit, :only_media, :exclude_replies, :keyword, :page).merge(core_params)
  end

end
