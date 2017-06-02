# frozen_string_literal: true

class PushPlaylistWorker
  include Sidekiq::Worker

  def perform(deck, event, payload)
    Redis.current.publish("streaming:music:deck:#{deck}", Oj.dump(event: event, payload: payload, queued_at: (Time.now.to_f * 1000.0).to_i))
  end
end
