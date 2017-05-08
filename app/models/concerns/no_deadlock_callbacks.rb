# frozen_string_literal: true

module NoDeadlockCallbacks
  extend ActiveSupport::Concern

  class NoDeadlockCallback
    attr_reader :klass, :association_name, :counter_cache

    def initialize(klass, association_name, counter_cache)
      @klass = klass
      @association_name = association_name
      @counter_cache = counter_cache
    end

    def increment(instance, by: 1)
      return unless counter_cache

      association = instance.association(association_name)

      if association.target && !association.stale_target?
        # target has been loaded
        association.target.increment!(counter_cache_column, by) unless association.target.destroyed?
      else
        target_id = association.__send__(:target_id)
        association.klass.update_counters(target_id, counter_cache_column => by) if target_id
      end
    end

    def decrement(instance)
      increment(instance, by: -1)
    end

    private

    def counter_cache_column
      if counter_cache == true
        "#{klass.name.demodulize.underscore.pluralize}_count"
      elsif counter_cache
        counter_cache.to_s
      end
    end
  end

  private_constant(:NoDeadlockCallback)

  included do
    class_attribute :_no_deadlock_callbacks, instance_accessor: false, instance_predicate: false
    self._no_deadlock_callbacks = []

    after_commit :no_deadlock_increment, on: :create
    after_commit :no_deadlock_decrement, on: :destroy
  end

  class_methods do
    def no_deadlock_callback(association_name, counter_cache: false)
      _no_deadlock_callbacks << NoDeadlockCallback.new(self, association_name, counter_cache)
    end
  end

  private

  def no_deadlock_increment
    self.class._no_deadlock_callbacks.each do |no_deadlock_callback|
      no_deadlock_callback.increment(self)
    end
  end

  def no_deadlock_decrement
    self.class._no_deadlock_callbacks.each do |no_deadlock_callback|
      no_deadlock_callback.decrement(self)
    end
  end
end
