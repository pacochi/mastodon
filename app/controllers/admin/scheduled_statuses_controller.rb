# frozen_string_literal: true

module Admin
  class ScheduledStatusesController < BaseController
    include HomeConcern

    protected

    def appmode
      'scheduledStatuses'
    end
  end
end
