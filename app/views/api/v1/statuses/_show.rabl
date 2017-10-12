attributes :id, :created_at, :in_reply_to_id,
           :in_reply_to_account_id, :sensitive,
           :spoiler_text, :visibility, :language

node(:uri)              { |status| TagManager.instance.uri_for(status) }
node(:content)          { |status| Formatter.instance.format(status) }
node(:text)             { |status| Formatter.instance.plaintext(status) }
node(:url)              { |status| TagManager.instance.url_for(status) }
node(:reblogs_count)    { |status| defined?(@reblogs_counts_map)    ? (@reblogs_counts_map[status.id]    || 0) : status.reblogs_count }
node(:favourites_count) { |status| defined?(@favourites_counts_map) ? (@favourites_counts_map[status.id] || 0) : status.favourites_count }
node(:pixiv_cards)      { |status| status.pixiv_cards.select(&:image_url?).map { |record| record.slice(:url, :image_url) }.compact }
node(:pinned)           { |status| status.pinned_status.present? }
node(:booth_item_url)   { |status| BoothUrl.extract_booth_item_url(Formatter.instance.plaintext(status)) }
node(:booth_item_id) do |status|
  text = Formatter.instance.plaintext(status)
  BoothUrl.extract_booth_item_id(text) || BoothUrl.extract_apollo_item_id(text)
end

child :application do
  extends 'api/v1/apps/show'
end

child :account do
  extends 'api/v1/accounts/show'
end

# pawoo iOSが対応していないので、一時的に除外する。🍺 飲みたい
child({ @object.media_attachments.reject(&:unknown?) => :media_attachments }, object_root: false) do
  extends 'api/v1/statuses/_media'
end

child :mentions, object_root: false do
  extends 'api/v1/statuses/_mention'
end

child :tags, object_root: false do
  extends 'api/v1/statuses/_tags'
end

child({ music: :album }, if: ->(status) { !status.reblog? && status.music.is_a?(Album) }) do
  attribute :title, :text
  node(:image) { |album| full_asset_url(album.image.url(:original)) }
end

child({ music: :track }, if: ->(status) { !status.reblog? && status.music.is_a?(Track) }) do
  attribute :title, :artist, :text

  node(:music) { |track| full_asset_url(track.music.url(:original)) }

  node :video do |track|
    hash = {}

    hash[:url] = full_asset_url(track.video.url(:original)) if track.video.present?
    hash[:image] = full_asset_url(track.video_image.url(:original)) if track.video_image.present?

    if track.video_blur_movement_band_top != 0 && track.video_blur_blink_band_top != 0
      hash[:blur] = {
        movement: {
          band: {
            top: track.video_blur_movement_band_top,
            bottom: track.video_blur_movement_band_bottom,
          },
          threshold: track.video_blur_movement_threshold,
        },
        blink: {
          band: {
            top: track.video_blur_blink_band_top,
            bottom: track.video_blur_blink_band_bottom,
          },
          threshold: track.video_blur_blink_threshold,
        },
      }
    end

    if track.video_particle_color.present?
      hash[:particle] = {
        limit: {
          band: {
            top: track.video_particle_limit_band_top,
            bottom: track.video_particle_limit_band_bottom,
          },
          threshold: track.video_particle_limit_threshold,
        },
        color: track.video_particle_color,
      }
    end

    hash[:lightleaks] = true if track.video_lightleaks

    if track.video_spectrum_mode.present? && track.video_spectrum_color.present?
      hash[:spectrum] = {
        mode: track.video_spectrum_mode,
        color: track.video_spectrum_color,
      }
    end

    hash
  end
end
