Fabricator(:music_attachment) do
  duration 1.minute
  title 'title'
  artist Faker::Name.name
  status
end
