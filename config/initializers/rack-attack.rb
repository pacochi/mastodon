class Rack::Attack
  # 一旦制限をなくす
  throttle('api', limit: 1_000_000_000_000, period: 5.minutes) do |req|
    req.ip if req.path.match(/\A\/api\/v/)
  end

  self.throttled_response = lambda do |env|
    now        = Time.now.utc
    match_data = env['rack.attack.match_data']

    headers = {
      'X-RateLimit-Limit'     => match_data[:limit].to_s,
      'X-RateLimit-Remaining' => '0',
      'X-RateLimit-Reset'     => (now + (match_data[:period] - now.to_i % match_data[:period])).iso8601(6),
    }

    [429, headers, [{ error: 'Throttled' }.to_json]]
  end
end

# 必要になりそうだから置いておく
Rack::Attack.blocklist('block fucking boy') do |req|
  black_list = %w(118.241.187.114).freeze
  black_list.include?(req.ip)
end
