import React from 'react';
import PropTypes from 'prop-types';

class VideoArtwork extends React.PureComponent {

  static propTypes = {
    muted: PropTypes.bool.isRequired,
    volume: PropTypes.number.isRequired,
    timeOffset: PropTypes.number.isRequired,
    videoUrl: PropTypes.string.isRequired,
  };

  videoRef = null;

  componentDidMount () {
    const { volume, timeOffset } = this.props;
    this.videoRef.currentTime = timeOffset;
    this.setVolume(volume);
    this.videoRef.play();
  }

  componentDidUpdate (prevProps) {
    const { volume } = this.props;

    if (prevProps.volume !== volume) {
      this.setVolume(volume);
    }
  }

  setVideoRef = (c) => {
    this.videoRef = c;
  }

  setVolume (volume) {
    this.videoRef.volume = volume / 100;
  }

  render () {
    const { muted, videoUrl } = this.props;
    return (
      <div className="queue-item__artwork">
        <video ref={this.setVideoRef} muted={muted}>
          <source src={videoUrl}/>
        </video>
      </div>
    );
  }

}

export default VideoArtwork;
