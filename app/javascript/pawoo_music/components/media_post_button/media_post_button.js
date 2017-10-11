import React, { PureComponent } from 'react';
import IconButton from '../icon_button';

export default class MediaPostButton extends PureComponent {

  render () {
    return (
      <a className='media-post-button' href='/tracks/new'>
        <IconButton src='plus' />
      </a>
    );
  }

};
