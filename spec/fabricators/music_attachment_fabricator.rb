Fabricator(:music_attachment) do
  duration 1.minute
  title 'title'
  artist { Faker::Name.name }
  music { attachment_fixture 'aint_we_got_fun_billy_jones1921.mp3' }
  image { attachment_fixture 'attachment.jpg' }
  status { Fabricate(:status, account: Fabricate(:user).account) }
end
