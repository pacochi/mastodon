# frozen_string_literal: true

module Mastodon
  module Version
    module_function

    def major
      1
    end

    def minor
      4
    end

    def patch
<<<<<<< HEAD
      3
=======
      1
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc
    end

    def pre
      nil
    end

    def to_a
      [major, minor, patch, pre].compact
    end

    def to_s
      to_a.join('.')
    end
  end
end
