object @account
extends 'api/v1/accounts/show'

child :popular_media_attachments, object_root: false do
  extends 'api/v1/statuses/_media'
end
