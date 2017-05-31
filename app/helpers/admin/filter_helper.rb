# frozen_string_literal: true

module Admin::FilterHelper
  ACCOUNT_FILTERS = %i(local remote by_domain silenced suspended recent username display_name email ip).freeze
  REPORT_FILTERS = %i(resolved account_id target_account_id).freeze

  FILTERS = (FORM_ACCOUNT_FILTERS + REPORT_FILTERS).freeze

  def filter_link_to(text, new_params)
    url = url_for(filtered_params(new_params))
    klass = 'selected' if filtered_params(params) == filtered_params(new_params)

    link_to(text, url, class: klass)
  end

  def table_link_to(icon, text, path, options = {})
    link_to safe_join([fa_icon(icon), text]), path, options.merge(class: 'table-action-link')
  end

  private

  def filter_params(more_params)
    controller_request_params.merge(more_params)
  end

  def filter_link_class(new_url)
    filtered_url_for(controller_request_params) == new_url ? 'selected' : ''
  end

  def filtered_url_for(url_params)
    url_for filter_params(url_params)
  end

  def controller_request_params
    params.permit(FILTERS)
  end
end
