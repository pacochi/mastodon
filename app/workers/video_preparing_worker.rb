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
  rescue ActiveRecord::RecordNotFound
    nil
  rescue
    Rails.logger.error 'failed to convert track id: ' + status.music_id

    error = VideoPreparationError.create!(track: status.music)
    begin
      NotifyService.new.call(status.account, error)
    rescue => e
      Rails.logger.error e
      error.destroy!
    end

    raise
  else
    NotifyService.new.call(status.account, status.music)
  end
end
