# frozen_string_literal: true

class Rack::Attack
  LIMIT = 60
  PERIOD = 1.minute

  # Rate limit logins
  throttle('login', limit: LIMIT, period: PERIOD) do |req|
    req.ip if req.path == '/auth/sign_in' && req.post?
  end

  # Rate limit sign-ups
  throttle('register', limit: LIMIT, period: PERIOD) do |req|
    req.ip if req.path == '/auth' && req.post?
  end

  # Rate limit forgotten passwords
  throttle('reminder', limit: LIMIT, period: PERIOD) do |req|
    req.ip if req.path == '/auth/password' && req.post?
  end
  
  # Rate limit forgotten passwords
  throttle('pixiv_omniauth', limit: LIMIT, period: PERIOD) do |req|
    req.ip if req.path == '/auth/oauth/pixiv' && req.get?
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
