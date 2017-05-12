object @account

extends 'api/v1/accounts/show'

child :media_attachments, object_root: false do
  collection(@media_attachments_map.fetch(@account.id, []))
  extends 'api/v1/statuses/_media'
end
