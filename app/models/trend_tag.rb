# frozen_string_literal: true

class TrendTag
  attr_reader :name
  attr_reader :description
  attr_reader :type

  def initialize(name, desc, type)
    @name = name
    @description = desc
    @type = type
  end
end
