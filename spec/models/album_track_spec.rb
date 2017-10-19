# frozen_string_literal: true

require 'rails_helper'

describe AlbumTrack, type: :model do
  describe '.position_between' do
    it 'aggressively rounds' do
      # (0.20, Infinity)
      expect(AlbumTrack.position_between(BigDecimal(0.12, 2), BigDecimal(0.21, 2))).to eq 0.2
    end

    it 'preserves the precision required to be greater than the predecessor' do
      # [0.14, 0.18)
      expect(AlbumTrack.position_between(BigDecimal(0.12, 2), BigDecimal(0.14, 2))).to eq 0.13
      expect(AlbumTrack.position_between(BigDecimal(0.12, 2), BigDecimal(0.17, 2))).to eq 0.15
    end

    it 'preserves the precision required to be less than the successor' do
      # [0.18, 0.20]
      expect(AlbumTrack.position_between(BigDecimal(0.12, 2), BigDecimal(0.18, 2))).to eq 0.15
      expect(AlbumTrack.position_between(BigDecimal(0.12, 2), BigDecimal(0.20, 2))).to eq 0.16
    end
  end
end
