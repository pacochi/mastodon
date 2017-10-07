# frozen_string_literal: true

class VideoPreparingWorker
  include Sidekiq::Worker

  sidekiq_options queue: :video_preparer, unique_for: 16.minutes

  def perform(id)
    status = Status.find(id)

    video = MusicConvertService.new.call(status.music)
    begin
      status.music.update! video: video
    ensure
      video.unlink
    end

    NotifyService.new.call(status.account, status.music)
  rescue ActiveRecord::RecordNotFound
    nil
  end
end
