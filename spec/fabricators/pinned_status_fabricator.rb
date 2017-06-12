Fabricator(:pinned_status) do
  account
  status { |attributes| Fabricate(:status, account: attributes[:account]) }
end
