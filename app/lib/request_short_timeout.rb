# frozen_string_literal: true

module RequestShortTimeout
  refine Request do
    private

    def timeout
      { write: 5, connect: 5, read: 5 }
    end
  end
end
