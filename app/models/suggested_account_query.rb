class SuggestedAccountQuery
  REDIS_KEY = "#{self}:suggested_account_ids".freeze

  attr_reader :current_scope, :excluded_ids, :seed, :limit, :page_number

  class << self
    delegate :exclude_ids, :shuffle, :all, to: :new

    # TODO: 自動的に検出するようにする
    # TODO: フォロー状況を元に、ランダムに似通ったユーザーを混ぜる
    # - localのみ
    # - R18を除く
    # - ファボ・フォロワー数・画像投稿経験の高いユーザーを上位から抜き出す
    # - フォロー数がフォロワー数より多いユーザーを閾値を設けて除外する
    # - 絵をよく投稿しているユーザーを優先する
    # - 社員は抜く(目視チェック)
    def suggested_account_ids
      redis.zrange(REDIS_KEY, 0, -1).map(&:to_i)
    end

    def suggested_account_ids=(ids)
      redis.multi do
        redis.del(REDIS_KEY)

        ids.each do |id|
          redis.zadd(REDIS_KEY, id, id)
        end

        redis.expire(REDIS_KEY, 3.month)
      end
    end

    private

    def redis
      Redis.current
    end
  end

  def initialize(current_scope = default_scoped, excluded_ids: [], seed: Random.new_seed, limit: 20, page_number: 0)
    @current_scope = current_scope
    @excluded_ids = excluded_ids
    @seed = seed
    @limit = limit
    @page_number = page_number
  end

  def exclude_ids(ids)
    with_options(excluded_ids: excluded_ids + ids)
  end

  def shuffle(seed)
    with_options(seed: seed)
  end

  def per(limit)
    with_options(limit: limit.to_i)
  end

  def page(page_number)
    with_options(page_number: page_number.to_i)
  end

  def last_page?(page_number)
    self.class.suggested_account_ids.length <= limit * page_number.to_i
  end

  def all
    offset = limit * page_number
    ids = (self.class.suggested_account_ids - excluded_ids).shuffle(random: Random.new(seed))[offset..(offset + limit - 1)]

    @current_scope.where(id: ids).where.not(id: excluded_ids).limit(limit)
  end

  private

  def default_scoped
    Account.where(suspended: false, silenced: false)
  end

  def with_options(new_options = {})
    current_options = {
      excluded_ids: excluded_ids,
      seed: seed,
      limit: limit,
      page_number: page_number
    }

    self.class.new(@current_scope, current_options.merge(new_options))
  end
end
