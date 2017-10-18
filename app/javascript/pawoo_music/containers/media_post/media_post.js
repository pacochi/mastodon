import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import TrackComposeContainer from '../track_compose';
import Delay from '../../components/delay';
import IconButton from '../../components/icon_button';
import { isMobile } from '../../util/is_mobile';
import TipsBalloonContainer from '../../../mastodon/containers/tips_balloon_container';

const mapStateToProps = (state) => ({
  isLogin: !!state.getIn(['meta', 'me']),
});

@connect(mapStateToProps)
export default class MediaPost extends PureComponent {

  static propTypes = {
    isLogin: PropTypes.bool.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.mobile = isMobile();
    this.state = { compose: false };
  }

  handleMediaPost = () => {
    const { isLogin } = this.props;
    if (!isLogin) {
      location.href = '/auth/sign_in';
      return;
    }

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
          <IconButton src='plus' title='Post Your Music!' />
        </div>
        <Delay className='media-post-track-compose-modal'>
          {this.state.compose && (
            <div className='media-post-track-compose-modal-body'>
              <TrackComposeContainer onClose={this.handleStopCompose} />
            </div>
          )}
        </Delay>
        <div className='media-post-tips-baloon'>
          <TipsBalloonContainer id={4} style={{ left: '35px', top: '5px' }} direction='top'>
            <FormattedMessage
              id='pawoo_music.media_post.tips_balloon'
              defaultMessage="Let's submit your track!"
            />
          </TipsBalloonContainer>
        </div>
      </div>
    );
  }

}
