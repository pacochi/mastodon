import React, { PureComponent } from 'react';
import TrackComposeContainer from '../../containers/track_compose';
import Delay from '../delay';
import IconButton from '../icon_button';
import { isMobile } from '../../util/is_mobile';

export default class MediaPost extends PureComponent {

  constructor(props, context) {
    super(props, context);
    this.mobile = isMobile();
    this.state = { compose: false };
  }

  handleMediaPost = () => {
    if (this.mobile) {
      location.href = '/tracks/new';
    } else {
      this.setState({ compose: true });
    }
  };

  handleStopCompose = () => {
    this.setState({ compose: false });
  };

  render () {
    return (
      <div className='media-post'>
        <div className='media-post-body' role='button' tabIndex='-1' onClick={this.handleMediaPost}>
          <IconButton src='plus' />
        </div>
        <Delay className='media-post-track-compose-modal'>
          {this.state.compose && (
            <div className='media-post-track-compose-modal-body'>
              <TrackComposeContainer onClose={this.handleStopCompose} />
            </div>
          )}
        </Delay>
      </div>
    );
  }

}
