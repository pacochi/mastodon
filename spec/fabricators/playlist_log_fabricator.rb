Fabricator(:playlist_log) do
  deck 1
  info "artist - music name"
  link "url"
  account
  skipped_account    { Fabricate(:account) }
  uuid               { sequence(:number) }
end
