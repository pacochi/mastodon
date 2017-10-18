Fabricator(:track) do
  duration 1.minute
  title 'title'
  artist { Faker::Name.name }
  music { attachment_fixture ['high.mp3', 'low.mp3'].sample }
end
