# frozen_string_literal: true

module Admin
  class ReportedStatusesController < BaseController
    before_action :set_report
    before_action :set_status

    def update
      @status.update(status_params)
      redirect_to admin_report_path(@report)
    end

    def destroy
      RemovalWorker.perform_async(@status.id)
      redirect_to admin_report_path(@report)
    end

    private

    def status_params
      params.require(:status).permit(:sensitive)
    end

<<<<<<< HEAD
    def set_status
      @status = @report.statuses.find(params[:id])
    end

    def set_report
      @report = Report.find(params[:report_id])
=======
    def set_report
      @report = Report.find(params[:report_id])
    end

    def set_status
      @status = @report.statuses.find(params[:id])
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc
    end
  end
end
