# frozen_string_literal: true

class SearchService < BaseService
  def call(query, limit, resolve = false, account = nil)
    results = { accounts: [], hashtags: [], statuses: [], toots: [] }

    return results if query.blank?

    if query =~ /\Ahttps?:\/\//
      resource = FetchRemoteResourceService.new.call(query)

      results[:accounts] << resource if resource.is_a?(Account)
      results[:statuses] << resource if resource.is_a?(Status)
    else
      results[:accounts] = AccountSearchService.new.call(query, limit, resolve, account)
      results[:hashtags] = Tag.search_for(query.gsub(/\A#/, ''), limit) unless query.start_with?('@')
      results[:statuses] = Status.search(query).to_a.select {|i| Status.exists?(i._source.id)} .map {|i| Status.find(i._source.id)}
    end

    results
  end
end
