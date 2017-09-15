Fabricator(:album) do
  title 'title'
  description 'description'
  image { attachment_fixture 'attachment.jpg' }
  status
end
