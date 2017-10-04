# frozen_string_literal: true

class VideoPreparingWorker
  include Sidekiq::Worker

  sidekiq_options queue: :video_preparer, unique_for: 16.minutes

  def perform(id)
    track = Track.joins(:status).includes(status: :account).find(id)

    video = MusicConvertService.new.call(track)
    begin
      track.update! video: video
    ensure
      video.unlink
    end

    NotifyService.new.call(track.status.account, track)
  rescue ActiveRecord::RecordNotFound
    nil
  end
end
