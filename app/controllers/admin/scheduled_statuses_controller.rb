# frozen_string_literal: true

module Admin
  class ScheduledStatusesController < BaseController
    include HomeConcern

    def index
      @appmode = 'scheduledStatuses'
      super
    end
  end
end
