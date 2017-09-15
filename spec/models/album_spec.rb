# frozen_string_literal: true

require 'rails_helper'

describe Album, type: :model do
  it 'does not truncate title when it is not changed' do
    album = Fabricate(:album)
    album.update! description: 'description'
    expect(album.previous_changes[:title]).to eq nil
  end

  it 'truncates title after 128 characters after it is changed' do
    album = Fabricate(:album, title: 'This is a text which is longer than 128 characters. A string, "hello!!!!!!" should be stripped from the end of the whole string. hello!!!!!!')
    expect(album.title).to eq 'This is a text which is longer than 128 characters. A string, "hello!!!!!!" should be stripped from the end of the whole string.'
  end

  it 'fails validation with description longer than 500 characters' do
    album = Fabricate.build(:album, description: Faker::Lorem.characters(501))
    album.validate
    expect(album.errors[:description]).to include I18n.t('albums.over_character_limit', max: 500)
  end

  it 'succeeds validation with description shorter than or equal to 500 characters' do
    album = Fabricate.build(:album, description: Faker::Lorem.characters(500))
    album.validate
    expect(album.errors[:description]).to be_empty
  end
end
