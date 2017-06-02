# frozen_string_literal: true
require 'securerandom'

class AddQueueItem
  attr_accessor :id, :title, :artist, :thumbnail_url, :music_url, :link, :source_type, :account

  class << self
    def create(link, account)
      #todo linkをパースしてAddQueueItemを作る
      AddQueueItem.new(id: SecureRandom.uuid, )
    end
  end
end
