Fabricator(:album) do
  title 'title'
  text 'text'
  image { attachment_fixture 'attachment.jpg' }
  account { |attrs| attrs[:status].nil? ? Fabricate(:user).account : attrs[:status].account }
  status { |attrs| Fabricate(:status, account: attrs[:account]) }
end
