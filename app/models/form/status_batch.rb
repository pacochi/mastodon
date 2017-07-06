# frozen_string_literal: true

class Form::StatusBatch
  include ActiveModel::Model

  attr_accessor :status_ids, :action

  ACTION_TYPE = %w(nsfw_on nsfw_off delete).freeze

  def save
    if %w(nsfw_on nsfw_off).include?(action)
      statuses = Status.where(id: MediaAttachment.where(status_id: status_ids).select(:status_id).reorder(nil))
      sensitive = action == 'nsfw_on'
      statuses.update_all(sensitive: sensitive)
    elsif action == 'delete'
      Status.where(id: status_ids).find_each do |status|
        RemovalWorker.perform_async(status.id)
      end
      true
    end
  rescue ActiveRecord::RecordInvalid
    false
  end
end
