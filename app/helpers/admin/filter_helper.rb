# frozen_string_literal: true

module Admin::FilterHelper
<<<<<<< HEAD
  FORM_ACCOUNT_FILTERS = [{ form_account_filter: %i[local remote by_domain silenced suspended recent search_type keyword] }].freeze
  REPORT_FILTERS = %i[resolved account_id target_account_id].freeze
=======
  ACCOUNT_FILTERS = %i(local remote by_domain silenced suspended recent username display_name email ip).freeze
  REPORT_FILTERS = %i(resolved account_id target_account_id).freeze
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc

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

<<<<<<< HEAD
  def compact_params(parameters)
    parameters.to_h.map { |key, value|
      value.compact! if value.is_a?(Hash)
      [key, value.presence]
    }.to_h.compact
  end

  def filtered_params(parameters)
    parameters = ActionController::Parameters.new(parameters) unless parameters.is_a?(ActionController::Parameters)
    compact_params(parameters.permit(FILTERS))
=======
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
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc
  end
end
