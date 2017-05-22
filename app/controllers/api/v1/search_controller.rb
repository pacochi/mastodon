# frozen_string_literal: true

class Api::V1::SearchController < ApiController
  respond_to :json
  MAX_HITS_TOTAL = 10000 # this value should be the same with index.max_result.window in ElasticSearch

  def index
    @search = OpenStruct.new(SearchService.new.call(params[:q], 5, params[:resolve] == 'true', current_account))
  end

  def statuses
    query = params[:query]
    current_page = params[:page].to_i
    statuses_limit = limit_param(DEFAULT_STATUSES_LIMIT)
    if (current_page * statuses_limit) > MAX_HITS_TOTAL
      current_page = (MAX_HITS_TOTAL / statuses_limit).ceil
    end

    search_results = Status.search(query).page(current_page).per(statuses_limit)
    # If no records are left after we exclude "records which exist in ES but do not in PSQL,"
    # JS gives an error. Since it is quite a rare case, we leave this issue for a while.
    @statuses = search_results.records
    @hits_total = [search_results.records.total, MAX_HITS_TOTAL].min
  end
end
