object false

node :hits_total do
  @hits_total
end

child @statuses, :object_root => false do
  extends 'api/v1/statuses/show'
end
