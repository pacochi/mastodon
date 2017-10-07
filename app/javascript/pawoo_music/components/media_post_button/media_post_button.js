import React, { PureComponent } from 'react';

export default class MediaPostButton extends PureComponent {

  render () {
    return (
      <a className='media-post-button' href='/tracks/new'>
        <span className='plus-button'>
          +
        </span>
      </a>
    );
  }

};
