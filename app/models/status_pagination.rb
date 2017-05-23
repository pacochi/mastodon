class StatusPagination
  attr_reader :status

  def initialize(status, target_account = nil)
    @status = status
    @target_account = target_account
  end

  def next
    @next ||= permitted_statuses_without_tree.where(id.gt(@status.id)).reorder(nil).first
  end

  def previous
    @previous ||= permitted_statuses_without_tree.where(id.lt(@status.id)).first
  end

  private

  def ancestor_and_descendant_ids
    @ancestor_and_descendant_ids ||= @status.ancestors.map(&:id) + @status.descendants.map(&:id)
  end

  def id
    Status.arel_table[:id]
  end

  def permitted_statuses_without_tree
    @status.account.statuses.permitted_for(@status.account, @target_account).where.not(id: ancestor_and_descendant_ids)
  end
end
