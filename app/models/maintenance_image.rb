class MaintenanceImage
  include ActiveModel::Model

  attr_accessor :id, :statuses, :images

  validates :id, :statuses, :images, presence: true

  def self.mappings
    @mappings ||= YAML.load_file(Rails.root.join('data', 'maintenance_images.yml')).map { |attributes| new(attributes) }
  end

  def self.by_status(status_code)
    status_code = status_code.to_i
    mappings.select { |instance| instance.statuses.include?(status_code) }
  end
end
