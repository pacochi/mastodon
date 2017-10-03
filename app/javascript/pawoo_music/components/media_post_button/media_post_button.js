import React, { PureComponent } from 'react';
import Link from '../link_wrapper';

export default class MediaPostButton extends PureComponent {

  render () {
    return (
      <Link className='media-post-button' to='/tracks/new'>
        <span className='plus-button'>
          +
        </span>
      </Link>
    );
  }

};
