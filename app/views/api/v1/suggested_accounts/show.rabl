extends 'api/v1/accounts/show'

child @media_attachments_map.fetch(@object.id, []), object_root: false do
  extends 'api/v1/statuses/_media'
end
