import React from 'react';
import PropTypes from 'prop-types';

class AudioArtwork extends React.PureComponent {

  static propTypes = {
    muted: PropTypes.bool.isRequired,
    volume: PropTypes.number.isRequired,
    timeOffset: PropTypes.number.isRequired,
    musicUrl: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string.isRequired,
  };

  audioRef = null;

  componentDidMount () {
    const { volume, timeOffset } = this.props;
    this.audioRef.currentTime = timeOffset;
    this.audioRef.volume = volume;
    this.audioRef.play();
  }

  componentDidUpdate (props) {
    const { volume } = this.props;

    if (props.volume !== volume) {
      this.audioRef.volume = volume;
    }
  }

  setAudioRef = (c) => {
    this.audioRef = c;
  }

  render () {
    const { muted, musicUrl, thumbnailUrl } = this.props;
    const thumbnail = (thumbnailUrl.includes("'") || !thumbnailUrl.match(/^https?:\/\//)) ? '' : thumbnailUrl;
    const nowPlayingArtwork = {
      backgroundImage: `url("${thumbnail}")`,
    };

    return (
      <div className="queue-item__artwork" style={nowPlayingArtwork}>
        <audio ref={this.setAudioRef} src={musicUrl} muted={muted} />
      </div>
    );
  }

}

export default AudioArtwork;
