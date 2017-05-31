# frozen_string_literal: true

class UnblockDomainService < BaseService
<<<<<<< HEAD
  def call(domain_block, retroactive)
    if retroactive
      accounts = Account.where(domain: domain_block.domain).in_batches

      if domain_block.silence?
        accounts.update_all(silenced: false)
      else
        accounts.update_all(suspended: false)
      end
    end
=======
  attr_accessor :domain_block
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc

  def call(domain_block, retroactive)
    @domain_block = domain_block
    process_retroactive_updates if retroactive
    domain_block.destroy
  end

  def process_retroactive_updates
    blocked_accounts.in_batches.update_all(update_options)
  end

  def blocked_accounts
    Account.where(domain: domain_block.domain)
  end

  def update_options
    { domain_block_impact => false }
  end

  def domain_block_impact
    domain_block.silence? ? :silenced : :suspended
  end
end
