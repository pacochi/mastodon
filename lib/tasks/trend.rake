# frozen_string_literal: true

HISTORY_COUNT = 3

namespace :trend do
  desc 'sample'
  task sample: :environment do
    start_time = '2017-05-21 12:00:00'
    diff = 60 * 30
    count = 200
    for i in (0...count)
      Rake::Task["trend:make"].execute(Time.at(Time.parse(start_time).to_i + i * diff).to_s)
    end
  end

  task make: :environment do |task, args|
    start_time = args || '2017-05-03 14:00:00'
    p TrendTagService.new.call(Time.parse(start_time))
  end
end
