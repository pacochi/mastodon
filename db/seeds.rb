Doorkeeper::Application.create!(name: 'Web', superapp: true, redirect_uri: Doorkeeper.configuration.native_redirect_uri, scopes: 'read write follow')

if Rails.env.development?
  domain = ENV['LOCAL_DOMAIN'] || Rails.configuration.x.local_domain
  admin  = Account.where(username: 'admin').first_or_initialize(username: 'admin')
  admin.save(validate: false)
  User.where(email: "admin@#{domain}").first_or_initialize(email: "admin@#{domain}", password: 'mastodonadmin', password_confirmation: 'mastodonadmin', confirmed_at: Time.now.utc, admin: true, account: admin).save!

  # Additional seeds of Pawoo Music
  account = User.find_by!(email: "admin@#{domain}").account

  track = Track.create!(
    music: File.open(Rails.root.join('spec', 'fixtures', 'files', 'high.mp3')),
    duration: 1.minute,
    title: 'High',
    artist: 'A Great Cat'
  )

  track_status_id = Status.next_id

  Status.create!(
    id: track_status_id,
    account: account,
    music: track,
    text: Rails.application.routes.url_helpers.short_account_status_url(account.username, track_status_id),
    visibility: :unlisted
  )

  album = Album.create!(
    image: File.open(Rails.root.join('spec', 'fixtures', 'files', 'attachment.jpg')),
    title: 'Sine Waves'
  )

  album_status_id = Status.next_id

  Status.create!(
    id: album_status_id,
    account: account,
    music: album,
    text: Rails.application.routes.url_helpers.short_account_status_url(account.username, album_status_id),
    visibility: :unlisted
  )

  AlbumTrack.create! album: album, track: track, position: '0.5'
end
