# frozen_string_literal: true

class Api::V1::SearchController < ApiController
  respond_to :json

  def index
    @search = OpenStruct.new(SearchService.new.call(params[:q], 5, params[:resolve] == 'true', current_account))
  end

  def statuses
    keyword = params[:keyword]
    current_page = params[:page].to_i
    @statuses = Status.search(keyword)
                      .page(current_page).per(limit_param(DEFAULT_STATUSES_LIMIT))
                      .to_a.select {|i| Status.exists?(i._source.id)} .map {|i| Status.find(i._source.id)}
  end
end
