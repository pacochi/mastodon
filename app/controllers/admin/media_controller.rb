# frozen_string_literal: true

module Admin
  class MediaController < StatusesController

    private

    def target_statuses
      account_media_status_ids = @account.media_attachments.attached.reorder(nil).select(:status_id).distinct
      @account.statuses.where(id: account_media_status_ids)
    end

    def redirect_path
      admin_account_media_path(@account.id, current_page_params)
    end

    def target_path(*args)
      admin_account_medium_path(*args)
    end
  end
end
