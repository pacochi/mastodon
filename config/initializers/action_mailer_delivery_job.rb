require 'action_mailer/delivery_job'

module ActionMailer
  class DeliveryJob
    # Just skip this, we dont want to perform the job again
    rescue_from('ActiveJob::DeserializationError') {}
  end
end
