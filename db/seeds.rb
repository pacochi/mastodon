Doorkeeper::Application.create!(name: 'Web', superapp: true, redirect_uri: Doorkeeper.configuration.native_redirect_uri, scopes: 'read write follow')

if Rails.env.development?
  domain = ENV['LOCAL_DOMAIN'] || Rails.configuration.x.local_domain
  admin  = Account.where(username: 'admin').first_or_initialize(username: 'admin')
  admin.save(validate: false)
  User.where(email: "admin@#{domain}").first_or_initialize(email: "admin@#{domain}", password: 'mastodonadmin', password_confirmation: 'mastodonadmin', confirmed_at: Time.now.utc, admin: true, account: admin).save!

  # Additional seeds of Pawoo Music
  account = User.find_by!(email: "admin@#{domain}").account

  track = Track.create!(
    music: File.open(Rails.root.join('spec', 'fixtures', 'files', 'aint_we_got_fun_billy_jones1921.mp3')),
    duration: 1.minute,
    title: "Ain't We Got Fun",
    artist: 'Billy Jones'
  )

  Status.create!(
    account: account,
    music: track,
    text: Rails.application.routes.url_helpers.short_account_track_url(account.username, track),
    visibility: :unlisted
  )

  album = Album.create!(
    image: File.open(Rails.root.join('spec', 'fixtures', 'files', 'attachment.jpg')),
    title: 'Digital History'
  )

  Status.create!(
    account: account,
    music: album,
    text: Rails.application.routes.url_helpers.short_account_album_url(account.username, album),
    visibility: :unlisted
  )

  AlbumTrack.create! album: album, track: track, position: '0.5'
end
