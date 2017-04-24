OmniAuth.config.test_mode = true

OmniAuth.config.mock_auth[:pixiv] = OmniAuth::AuthHash.new(
  provider: 'pixiv',
  uid: '1',
  info: {
    email: 'test@pawoo.dev',
    name: 'testuser_name',
    nickname: 'testuser_account',
    id: 1,
    avatar: 'http://localhost/test.jpg'
  },
  extra: {
    raw_info: {}
  }
)
