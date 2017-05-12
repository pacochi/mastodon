
class TrendService < BaseService

  @@MOCK_TREND = [
    TrendTag.new(
      'エロマンガ先生',
      '2500件のトゥート',
      'trend'),
    TrendTag.new(
      'Photo',
      '2500件のトゥート',
      'trend'),
    TrendTag.new(
      'FGO',
      '2500件のトゥート',
      'trend'),
    TrendTag.new(
      'pixiv',
      '2500件のトゥート',
      'trend'),
    TrendTag.new(
      'nhk',
      '2500件のトゥート',
      'trend'),
    TrendTag.new(
      'pawoo',
      '2500件のトゥート',
      'trend'),
  ]


  def find_trend(limit = 5)
    @@MOCK_TREND.first(limit)
  end

  def find_suggestion(limit = 3)
    SuggestionTag.all.order(:order).first(limit).map do |tag|
      TrendTag.new(tag.tag.name, tag.description, 'suggestion')
    end
  end
end
