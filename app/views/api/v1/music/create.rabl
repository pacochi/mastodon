object @media
attribute :id, :type
node(:url) { |media| full_asset_url(media.file.url(:original)) }
node(:text_url) { |media| medium_url(media) }
