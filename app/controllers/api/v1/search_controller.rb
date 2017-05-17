# frozen_string_literal: true

class Api::V1::SearchController < ApiController
  respond_to :json
  SEARCH_HITS_TOTAL_HEADER = 'search-hits-total'
  MAX_HITS_TOTAL = 10000

  def index
    @search = OpenStruct.new(SearchService.new.call(params[:q], 5, params[:resolve] == 'true', current_account))
  end

  def statuses
    query = params[:query]
    current_page = params[:page].to_i
    search_results = Status.search(query)

    @statuses = search_results
                      .page(current_page).per(limit_param(DEFAULT_STATUSES_LIMIT))
                      .to_a.select {|i| Status.exists?(i._source.id)} .map {|i| Status.find(i._source.id)}
    response.headers[SEARCH_HITS_TOTAL_HEADER] = [search_results.records.total, MAX_HITS_TOTAL].min
  end
end
