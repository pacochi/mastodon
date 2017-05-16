Rails.configuration.x.fan_out_batch_size = ENV.fetch('FAN_OUT_BACKGROUND_JOB_BATCH_SIZE') { 1 }
