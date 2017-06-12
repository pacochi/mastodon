# frozen_string_literal: true

namespace :error_page do
  desc 'Generate static error pages'
  task generate: :environment do
    status_codes = [403, 410, 422, 500, 503]
    locales = I18n.available_locales
    public_path = Rails.application.paths['public'].existent.first

    raise 'public path is not found' unless public_path

    def write_template(path, html)
      Rails.logger.debug("Write error page: #{path}")
      File.write(path, html)
    end

    status_codes.each do |status_code|
      locales.each do |locale|
        html = I18n.with_locale(locale) do
          ApplicationController.renderer.render(layout: 'error', template: "errors/#{status_code}", locale: locale, status: status_code)
        end

        write_template(File.join(public_path, "#{status_code}.#{locale}.html"), html)

        # default localeの場合は、localeのsuffixがないファイルも用意する
        write_template(File.join(public_path, "#{status_code}.html"), html) if locale == I18n.default_locale
      end
    end
  end
end
