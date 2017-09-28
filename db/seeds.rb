Doorkeeper::Application.create!(name: 'Web', superapp: true, redirect_uri: Doorkeeper.configuration.native_redirect_uri, scopes: 'read write follow')

if Rails.env.development?
  domain = ENV['LOCAL_DOMAIN'] || Rails.configuration.x.local_domain
  admin  = Account.where(username: 'admin').first_or_initialize(username: 'admin')
  admin.save(validate: false)
  User.where(email: "admin@#{domain}").first_or_initialize(email: "admin@#{domain}", password: 'mastodonadmin', password_confirmation: 'mastodonadmin', confirmed_at: Time.now.utc, admin: true, account: admin).save!

  # Additional seeds of Pawoo Music
  account = User.find_by!(email: "admin@#{domain}").account

  music_attachment_status = Status.new(account: account, text: '', visibility: :unlisted)
  music_attachment_status.save! validate: false

  music_attachment = MusicAttachment.create!(
    music: File.open(Rails.root.join('spec', 'fixtures', 'files', 'aint_we_got_fun_billy_jones1921.mp3')),
    duration: 1.minute,
    title: "Ain't We Got Fun",
    artist: 'Billy Jones',
    account: music_attachment_status.account,
    status: music_attachment_status
  )

  music_attachment_status.update! text: Rails.application.routes.url_helpers.short_account_track_url(account.username, music_attachment)

  album_status = Status.new(account: account, text: '', visibility: :unlisted)
  album_status.save! validate: false

  album = Album.create!(
    image: File.open(Rails.root.join('spec', 'fixtures', 'files', 'attachment.jpg')),
    title: 'Digital History',
    account: album_status.account,
    status: album_status
  )

  album_status.update! text: Rails.application.routes.url_helpers.short_account_album_url(account.username, album)

  AlbumMusicAttachment.create!(
    album: album,
    music_attachment: music_attachment,
    position: '0.5'
  )
end
