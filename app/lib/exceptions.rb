# frozen_string_literal: true

module Mastodon
  class Error < StandardError; end
  class NotPermittedError < Error; end
  class ValidationError < Error; end
  class RaceConditionError < Error; end
  class MusicSourceNotFoundError < Error; end
  class MusicSourceForbidden < Error; end
  class PlayerControlLimitError < Error; end
  class PlayerControlSkipLimitTimeError < Error; end
  class PlaylistSizeOverError < Error; end
  class PlaylistEmptyError < Error; end
  class RedisMaxRetryError < Error; end
end
