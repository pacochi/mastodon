# frozen_string_literal: true

class TrendTagService < BaseService
  SPAN = 60.minutes
  HISTORY_COUNT = 3

  FAVOURITES_COUNT_MIN = 1
  REBLOGS_COUNT_MIN = 1
  USERS_COUNT_MIN = 3
  TREND_HISTORIES_KEY = 'trend_histories'

  StatusTags = Struct.new(:status_id, :tag_id)

  def call(time)
    status_ids = find_status_ids_from_time(time)
    # 発言がなければトレンドは無し
    return [] if status_ids.blank?

    current_score = calc_current_score(status_ids)

    # redisに新しいハッシュタグのスコア履歴を保存する
    # 履歴の数がHISTORY_COUNTより少ない場合はトレンドを出すことができないため、空配列を返す
    len = redis.llen(TREND_HISTORIES_KEY)
    redis.lpush(TREND_HISTORIES_KEY, current_score.to_json)
    redis.rpop(TREND_HISTORIES_KEY) if HISTORY_COUNT < redis.llen(TREND_HISTORIES_KEY)
    return [] if len + 1 < HISTORY_COUNT

    # 現在のトレンドを出してredisに保存する
    current_trend = calc_current_trend(current_score)
    redis.set(TrendTag::TREND_CURRENT_KEY, current_trend.to_json)
    current_trend
  end

  private

  # 現在の各タグのスコアの計算
  def calc_current_score(status_ids)
    status_tags = Status.joins(:tags).where(id: status_ids).pluck(:id, :tag_id).map { |it| StatusTags.new(it[0], it[1]) }
    statuses = Status.where(id: status_tags.map(&:status_id).uniq, uri: nil)
    tags = Tag.where(id: status_tags.map(&:tag_id).uniq)

    # #pixivのタグが付いているStatusを弾く
    pixiv_hashtag_id = 16
    reject_status_ids = status_tags.select { |it| it.tag_id == pixiv_hashtag_id }.map(&:status_id)
    statuses = statuses.reject { |it| reject_status_ids.include?(it.id) }

    # tagでStatusをグルーピングする
    status_tags = status_tags.group_by(&:tag_id)

    # NGワードを含むハッシュタグを弾く
    trend_ng_words = TrendNgWord.pluck(:word)
    tags = tags.reject { |tag| trend_ng_words.any? { |ng_word| tag.name.include?(ng_word) } }

    # 現在の各ハッシュタグのスコアを出す
    current_score = tags.map { |tag| create_score_obj(tag, status_tags, statuses) }.reject(&:nil?).to_h
    current_score || {}
  end

  # 現在のスコアからトレンドの配列を返します。
  # トレンドは過去のスコアの平均から現在のスコアがどれだけ伸びたかの伸び率で出します。
  # 伸び率が1.0以下のものはトレンドから除外されるため、トレンドが出ずにから配列が返ることもあります。
  def calc_current_trend(current_score)
    # redisからスコアの履歴を復元
    history = (0...HISTORY_COUNT).map { |i| JSON.parse(redis.lindex(TREND_HISTORIES_KEY, i), symbolize_names: true) }

    # 最新の履歴はcurrent_scoreなので除外して、過去のスコアを合計する
    len = HISTORY_COUNT - 1
    merged_tag_score = history.last(len).flatten.reduce do |a, entry|
      a.merge(entry) do |_, oldval, newval|
        {
          tag_id: oldval[:tag_id],
          tag_name: oldval[:tag_name],
          favourites_count: oldval[:favourites_count] + newval[:favourites_count],
          reblogs_count: oldval[:reblogs_count] + newval[:reblogs_count],
          user_count: oldval[:user_count] + newval[:user_count],
          score: oldval[:score] + newval[:score],
        }
      end
    end

    # すべての履歴に登場するタグのみ候補として残す
    merged_tag_score = merged_tag_score.values.reject { |it| it[:score].nil? || it[:score] <= 0 }

    # 各タグのスコアの平均を求める
    tag_score_avg = merged_tag_score.map do |tag_score|
      next if tag_score[:score].to_f / len < calc_score(FAVOURITES_COUNT_MIN, REBLOGS_COUNT_MIN, USERS_COUNT_MIN) / 2
      {
        tag_id: tag_score[:tag_id],
        tag_name: tag_score[:tag_name],
        favourites_count: tag_score[:favourites_count].to_f / len,
        reblogs_count: tag_score[:reblogs_count].to_f / len,
        user_count: tag_score[:user_count].to_f / len,
        score: tag_score[:score].to_f / len,
      }
    end
    # 条件に弾かれたtagを弾き、タグのidをキーとしたhashに変換する
    tag_score_avg = tag_score_avg.reject(&:nil?).group_by { |it| it[:tag_id] }

    # 過去スコアから現在スコアの伸び率を求める
    tag_score = current_score.values.map do |tag|
      history = tag_score_avg[tag[:tag_id]]
      next unless history
      history = history.first
      { tag_name: tag[:tag_name], tag_id: tag[:tag_id], growth: tag[:score] / history[:score], avg: history[:score], current: tag[:score] }
    end

    # 伸び率が1.0以下のものを弾いて、伸び率が上位3つをトレンドとして返す
    tag_score = tag_score.reject(&:nil?).reject { |score| score[:growth] < 1.0 }
    tag_score.sort_by { |score| score[:growth] }.last(3).reverse
  end

  # 以下の条件にマッチする特定期間内のローカルタイムラインのStatus idのリストを返します
  def find_status_ids_from_time(time)
    time_from = time.ago(SPAN)
    time_to = time

    Status.where(created_at: [time_from..time_to], uri: nil).pluck(:id)
  end

  def calc_score(favourites_count, reblogs_count, user_count)
    favourites_count * 1 + reblogs_count * 3 + user_count * 30
  end

  # タグのスコアを計算します。
  # また、以下のいずれかの条件にマッチしないタグは候補から外すためにnilを返します
  #
  # - ハッシュタグを利用したユーザー数がUSERS_COUNT_MINより小さい
  # - ハッシュタグに対するお気に入りがFAVOURITES_COUNT_MINより小さい
  # - ハッシュタグに対するリブログがREBLOGS_COUNT_MINよりちいさい
  # - 本文にハッシュタグ以外の文字列が含まれていない
  def create_score_obj(tag, status_tags, statuses)
    tag_statuses = statuses.select { |s| status_tags[tag.id].any? { |st| st.status_id == s.id } }

    # 本文がタグのみの投稿を弾く(タグのみで遊ぶ投稿への対策、内容のないものはトレンドとしてふさわしくない)
    tag_statuses = tag_statuses.reject { |ts| ts.text.gsub(/#\S+/, '').strip.empty? }

    # そのタグをトゥートしたaccountの数
    user_count = tag_statuses.map(&:account_id).uniq.size
    return nil if user_count < USERS_COUNT_MIN

    # そのタグのfavourites合計
    favourites_count = tag_statuses.sum {|ts| ts[:favourites_count]}
    return nil if favourites_count < FAVOURITES_COUNT_MIN

    # そのタグのreblogs合計
    reblogs_count = tag_statuses.sum {|ts| ts[:reblogs_count]}
    return nil if reblogs_count < REBLOGS_COUNT_MIN

    # スコア
    score = calc_score(favourites_count, reblogs_count, user_count)

    [tag.id, { tag_id: tag.id, tag_name: tag.name, favourites_count: favourites_count, reblogs_count: reblogs_count, user_count: user_count, score: score }]
  end

  def redis
    Redis.current
  end
end
