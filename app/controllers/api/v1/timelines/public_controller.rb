# frozen_string_literal: true

class Api::V1::Timelines::PublicController < Api::BaseController
  after_action :insert_pagination_headers, unless: -> { @statuses.empty? }

  respond_to :json

  def show
    @statuses = load_statuses
    render 'api/v1/timelines/show'
  end

  private

<<<<<<< HEAD
    def public_statuses
      statuses = public_timeline_statuses.paginate_by_max_id(
        limit_param(DEFAULT_STATUSES_LIMIT),
        params[:max_id],
        params[:since_id]
      )

      if params[:media]
        # `SELECT DISTINCT id, updated_at` is too slow, so pluck ids at first, and then select id, updated_at with ids.
        status_ids = statuses.joins(:media_attachments).distinct(:id).pluck(:id)
        statuses.where(id: status_ids)
      else
        statuses
      end
=======
  def load_statuses
    cached_public_statuses.tap do |statuses|
      set_maps(statuses)
>>>>>>> 947887f261f74f84312327a5265553e8f16655fe
    end
  end

  def cached_public_statuses
    cache_collection public_statuses, Status
  end

<<<<<<< HEAD
    def next_path
      api_v1_timelines_public_url pagination_params(max_id: @statuses.last.id, media: params[:media])
    end

    def prev_path
      api_v1_timelines_public_url pagination_params(since_id: @statuses.first.id, media: params[:media])
    end
=======
  def public_statuses
    public_timeline_statuses.paginate_by_max_id(
      limit_param(DEFAULT_STATUSES_LIMIT),
      params[:max_id],
      params[:since_id]
    )
  end

  def public_timeline_statuses
    Status.as_public_timeline(current_account, params[:local])
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def pagination_params(core_params)
    params.permit(:local, :limit).merge(core_params)
  end

  def next_path
    api_v1_timelines_public_url pagination_params(max_id: pagination_max_id)
  end

  def prev_path
    api_v1_timelines_public_url pagination_params(since_id: pagination_since_id)
  end

  def pagination_max_id
    @statuses.last.id
  end

  def pagination_since_id
    @statuses.first.id
>>>>>>> 947887f261f74f84312327a5265553e8f16655fe
  end
end
