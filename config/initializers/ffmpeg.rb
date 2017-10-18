# frozen_string_literal: true

Rails.application.configure do
  config.x.ffmpeg_options = if ENV['FFMPEG_OPTIONS'].nil?
                              nil
                            else
                              Shellwords.shellwords(ENV['FFMPEG_OPTIONS'])
                            end
end
