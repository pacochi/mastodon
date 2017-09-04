# frozen_string_literal: true

require 'rails_helper'

describe MusicAttachment, type: :model do
  it 'does not truncate title when it is not changed' do
    music = Fabricate(:music_attachment)
    music.update! duration: 2.minutes
    expect(music.previous_changes[:title]).to eq nil
  end

  it 'truncates title after 128 characters after it is changed' do
    music = Fabricate(:music_attachment, title: 'This is a text which is longer than 128 characters. A string, "hello!!!!!!" should be stripped from the end of the whole string. hello!!!!!!')
    expect(music.title).to eq 'This is a text which is longer than 128 characters. A string, "hello!!!!!!" should be stripped from the end of the whole string.'
  end
end
