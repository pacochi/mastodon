# frozen_string_literal: true

class Api::V1::MusicController < ApiController
  before_action -> { doorkeeper_authorize! :write }
  before_action :require_user!

  # include ObfuscateFilename
  # obfuscate_filename :file

  respond_to :json

  def create
    # TODO: 後でやる
    @media = MediaAttachment.create!(account: current_user.account, file: media_params[:file], type: MediaAttachment.types[:music])
  end

end
