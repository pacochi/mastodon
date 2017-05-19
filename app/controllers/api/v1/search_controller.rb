# frozen_string_literal: true

class Api::V1::SearchController < ApiController
  respond_to :json
  MAX_HITS_TOTAL = 10000

  def index
    @search = OpenStruct.new(SearchService.new.call(params[:q], 5, params[:resolve] == 'true', current_account))
  end

  def statuses
    query = params[:query]
    current_page = params[:page].to_i

    search_results = Status.search(query).page(current_page).per(limit_param(DEFAULT_STATUSES_LIMIT))
    @statuses = Status.where(id: search_results.map{ |result| result._source.id })
    @hits_total = [search_results.records.total, MAX_HITS_TOTAL].min
  end
end
