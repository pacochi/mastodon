# frozen_string_literal: true

class VideoPreparingWorker
  include Sidekiq::Worker

  def perform(id)
    music_attachment = MusicAttachment.joins(:status).includes(status: :account).find(id)
    NotifyService.new.call(music_attachment.status.account, music_attachment)
  rescue ActiveRecord::RecordNotFound
    nil
  end
end
