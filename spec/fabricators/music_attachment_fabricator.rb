Fabricator(:music_attachment) do
  duration 1.minute
  title 'title'
  artist { Faker::Name.name }
  music { attachment_fixture 'aint_we_got_fun_billy_jones1921.mp3' }
  account { |attrs| attrs[:status].nil? ? Fabricate(:user).account : attrs[:status].account }
  status { |attrs| Fabricate(:status, account: attrs[:account]) }
end
