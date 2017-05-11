# frozen_string_literal: true

class TrendTag
  attr_reader :name
  attr_reader :url
  attr_reader :description
  attr_reader :type

  def initialize(name, url, desc, type)
    @name = name
    @url = url
    @description = desc
    @type = type
  end
end
