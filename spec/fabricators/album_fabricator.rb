Fabricator(:album) do
  title 'title'
  text 'text'
  image { attachment_fixture 'attachment.jpg' }
end
