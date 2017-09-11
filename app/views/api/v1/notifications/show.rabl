object @notification

attributes :id, :type, :created_at

child from_account: :account do
  extends 'api/v1/accounts/show'
end

node(:status, if: lambda { |n| [:favourite, :reblog, :mention].include?(n.type) }) do |n|
  partial 'api/v1/statuses/show', object: n.target_status
end

node :track, if: lambda { |n| n.type == :video_prepared } do |n|
  partial 'api/v1/tracks/show', object: n.activity
end
