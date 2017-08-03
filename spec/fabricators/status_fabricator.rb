Fabricator(:status) do
  account
  created_at 4.seconds.ago
  text "Lorem ipsum dolor sit amet"
end
