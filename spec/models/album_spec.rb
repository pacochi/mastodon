# frozen_string_literal: true

require 'rails_helper'

describe Album, type: :model do
  it 'does not truncate title when it is not changed' do
    album = Fabricate(:album)
    album.update! text: 'text'
    expect(album.previous_changes[:title]).to eq nil
  end

  it 'truncates title after 128 characters after it is changed' do
    album = Fabricate(:album, title: 'This is a text which is longer than 128 characters. A string, "hello!!!!!!" should be stripped from the end of the whole string. hello!!!!!!')
    expect(album.title).to eq 'This is a text which is longer than 128 characters. A string, "hello!!!!!!" should be stripped from the end of the whole string.'
  end
end
