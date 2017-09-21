# frozen_string_literal: true

require 'rails_helper'

describe MusicAttachment, type: :model do
  it 'does not truncate title when it is not changed' do
    music = Fabricate(:music_attachment)
    music.update! artist: Faker::Name.name
    expect(music.previous_changes[:title]).to eq nil
  end

  it 'truncates title after 128 characters after it is changed' do
    music = Fabricate(:music_attachment, title: 'This is a text which is longer than 128 characters. A string, "hello!!!!!!" should be stripped from the end of the whole string. hello!!!!!!')
    expect(music.title).to eq 'This is a text which is longer than 128 characters. A string, "hello!!!!!!" should be stripped from the end of the whole string.'
  end

  it 'does not truncate artist when it is not changed' do
    music = Fabricate(:music_attachment)
    music.update! title: Faker::Name.name
    expect(music.previous_changes[:artist]).to eq nil
  end

  it 'truncates artist after 128 characters before saving' do
    music = Fabricate(:music_attachment, artist: 'This is a text which is longer than 128 characters. A string, "hello!!!!!!" should be stripped from the end of the whole string. hello!!!!!!')
    expect(music.artist).to eq 'This is a text which is longer than 128 characters. A string, "hello!!!!!!" should be stripped from the end of the whole string.'
  end

  it 'truncates description after 500 characters after it is changed' do
    music = Fabricate(:music_attachment, description: Faker::Lorem.characters(501))
    expect(music.description.size).to eq 500
  end

  it 'does not truncate description when it is not changed' do
    music = Fabricate(:music_attachment)
    music.update! title: Faker::Name.name
    expect(music.previous_changes[:description]).to eq nil
  end
end
