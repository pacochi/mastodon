# frozen_string_literal: true

class VideoPreparingWorker
  include Sidekiq::Worker

  sidekiq_options unique_for: 16.minutes

  def perform(id)
    music_attachment = MusicAttachment.joins(:status).includes(status: :account).find(id)

    video = MusicConvertService.new.call(music_attachment)
    begin
      music_attachment.update! video: video
    ensure
      video.unlink
    end

    NotifyService.new.call(music_attachment.status.account, music_attachment)
  rescue ActiveRecord::RecordNotFound
    nil
  end
end
