object @search

child :accounts, object_root: false do
  extends 'api/v1/accounts/show'
end

node(:hashtags) do |search|
  search.hashtags.map(&:name)
end

child :statuses, object_root: false do
  extends 'api/v1/statuses/show'
end

node(:toots) do |search|
  search.toots.map {|i| {id: i._source.id, text: i._source.text}}
end
