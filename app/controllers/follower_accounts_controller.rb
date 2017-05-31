# frozen_string_literal: true

class FollowerAccountsController < ApplicationController
  include AccountControllerConcern

  def index
<<<<<<< HEAD
    @follows = Follow.where(target_account: @account).order(id: :desc).page(params[:page]).per(FOLLOW_PER_PAGE).preload(:account)
=======
    @follows = Follow.where(target_account: @account).recent.page(params[:page]).per(FOLLOW_PER_PAGE).preload(:account)
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc
  end
end
