import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Musicvideo from '../musicvideo';

import playIcon from '../../../images/pawoo_music/play.png';
import defaultArtwork from '../../../images/pawoo_music/default_artwork.png';

class Track extends ImmutablePureComponent {

  static propTypes = {
    track:  ImmutablePropTypes.map,
  };

  state = {
    thumbnailView: true,
  }

  componentWillUnmount () {
    this.setState({
      thumbnailView: false,
    });
  }

  handlePlayClick = () => {
    const { thumbnailView } = this.state;
    this.setState({
      thumbnailView: !thumbnailView,
    });
  }

  render() {
    const { track } = this.props;
    const { thumbnailView } = this.state;
    if (!track) {
      return null;
    }

    return (
      <div className='track'>
        <div className='musicvideo-wrapper'>
          {!thumbnailView ? (
            <Musicvideo track={track} />
          ) : (
            <div className='thumbnail'>
              <img className='albumart'   src={track.getIn(['video', 'image']) || defaultArtwork} alt='albumart' />
              <img className='playbutton' src={playIcon}                        alt='playbutton' role='button' tabIndex='0' aria-pressed='false' onClick={this.handlePlayClick} />
            </div>
          )}
        </div>
        <div className='credit'>
          {`${track.get('artist')} - ${track.get('title')}`}
        </div>
      </div>
    );
  }

}

export default Track;
