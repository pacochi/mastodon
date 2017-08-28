Fabricator(:music_attachment) do
  duration 1.minute
  media_attachment
  title 'title'
  artist Faker::Name.name
end
