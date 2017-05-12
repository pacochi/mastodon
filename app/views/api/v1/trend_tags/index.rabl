collection @trend_tags
attributes :name , :description, :type
node(:url) { |tag| tag_url(tag.name) }
