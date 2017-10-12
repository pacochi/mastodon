import UAParser from 'ua-parser-js';
import React, { PureComponent } from 'react';
import IconButton from '../icon_button';

export default class MediaPostButton extends PureComponent {

  constructor(props, context) {
    super(props, context);
    this.mobile = ['mobile', 'tablet'].includes(new UAParser().getDevice().type);
  }

  handleMediaPost = () => {
    if (this.mobile) {
      location.href = '/tracks/new';
    } else {
      location.href = '/tracks/new';
    }
  };

  render () {
    return (
      <div className='media-post-button' onClick={this.handleMediaPost}>
        <IconButton src='plus' />
      </div>
    );
  }

};
