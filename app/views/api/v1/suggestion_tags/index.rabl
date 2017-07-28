collection @suggestion_tags
attributes :name, :description
attribute suggestion_type: :type
node(:url) { |tag| tag_url(tag.name) }
