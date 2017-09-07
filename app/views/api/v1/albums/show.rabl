object @album

attribute :id, :title, :description

node :image { |album| full_asset_url(album.image.url(:original)) }
child :status { extends 'api/v1/statuses/show' }
