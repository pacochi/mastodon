require 'rails_helper'

describe TimeLimit do
  describe '.from_tags' do
    it 'returns true' do
      tags = [
        Fabricate(:tag, name: "hoge"),
        Fabricate(:tag, name: "exp1m"),
        Fabricate(:tag, name: "fuga"),
        Fabricate(:tag, name: "exp10m"),
      ]
      result = TimeLimit.from_tags(tags)
      expect(result.to_duration).to eq(1.minute)
    end
  end

  describe '#valid?' do
    context 'valid tag_name' do
      it 'returns true' do
        result = TimeLimit.new('exp1m').valid?
        expect(result).to be true
      end
    end

    context 'invalid tag_name' do
      it 'returns false' do
        result = TimeLimit.new('10m').valid?
        expect(result).to be false
      end
      it 'returns false' do
        result = TimeLimit.new('exp10s').valid?
        expect(result).to be false
      end
    end

    context 'invalid time' do
      it 'returns false' do
        result = TimeLimit.new('exp8d').valid?
        expect(result).to be false
      end

      it 'returns false' do
        result = TimeLimit.new("exp#{24 * 8}h").valid?
        expect(result).to be false
      end
    end
  end

  describe '#to_duration' do
    context 'valid tag_name' do
      it 'returns positive numeric' do
        result = TimeLimit.new('exp1m').to_duration
        expect(result.positive?).to be true
      end
    end

    context 'invalid tag_name' do
      it 'returns 0' do
        result = TimeLimit.new('10m').to_duration
        expect(result).to be 0
      end
      it 'returns 0' do
        result = TimeLimit.new('exp10s').to_duration
        expect(result).to be 0
      end
    end
  end
end
