# frozen_string_literal: true

class TimeLimit
  TIME_LIMIT_RE = /^exp(?<value>\d+)(?<unit>[mhd])$/
  VALID_DURATION = (1.minute..7.days)

  def self.from_tags(tags)
    return unless tags

    tags.map { |tag| new(tag.name) }.find(&:valid?)
  end

  def initialize(name)
    @name = name
  end

  def valid?
    TIME_LIMIT_RE.match?(@name) && VALID_DURATION.include?(to_duration)
  end

  def to_duration
    matched = @name.match(TIME_LIMIT_RE)

    case matched[:unit]
    when 'm'
      matched[:value].to_i.minutes
    when 'h'
      matched[:value].to_i.hours
    when 'd'
      matched[:value].to_i.days
    else
      raise NotImplementedError, "Unsupported unit(#{matched[:unit]}) given"
    end
  end
end
