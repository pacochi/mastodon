object @account

extends 'api/v1/accounts/show'

child :media_attachments, object_root: false do
  extends 'api/v1/statuses/_media'
end
