import React from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';

class YouTubeArtwork extends React.PureComponent {

  static propTypes = {
    muted: PropTypes.bool.isRequired,
    volume: PropTypes.number.isRequired,
    timeOffset: PropTypes.number.isRequired,
    videoId: PropTypes.string.isRequired,
    onReadyYoutube: PropTypes.func.isRequired,
  };

  ytControl = null;
  isYoutubeLoadingDone = false;

  componentDidUpdate (prevProps) {
    const { muted, volume } = this.props;

    if (prevProps.muted !== muted) {
      this.changeMute();
    }

    if (prevProps.volume !== volume) {
      this.setVolume(volume);
    }
  }

  setVolume (volume) {
    if (this.ytControl) {
      this.ytControl.setVolume(volume);
    }
  }

  changeMute () {
    if (this.ytControl) {
      const { muted } = this.props;

      if (muted) {
        this.ytControl.mute();
      } else {
        this.ytControl.unMute();
      }
    }
  }

  onReadyYouTube = (event) => {
    const { volume } = this.props;
    this.ytControl = event.target;
    this.changeMute();
    this.setVolume(volume);
  }

  // Youtubeの動画の読み込みが完了し、再生が始まると呼ばれる
  onChangeYoutubeState = () => {
    // さらにiframeにpostMessageが送られてくるまで2秒ほど待つ
    // 2秒待たない間にコンポーネントが削除されると、デベロッパーコンソールが開く
    setTimeout(() => {
      if (!this.isYoutubeLoadingDone) {
        this.isYoutubeLoadingDone = true;
        this.props.onReadyYoutube();
      }
    }, 2000);
  }

  render () {
    const { videoId, timeOffset } = this.props;
    const option = {
      playerVars: {
        autoplay: 1,
        controls: 0,
        start: timeOffset,
      },
    };
    return (
      <div className="queue-item__artwork">
        <YouTube
          videoId={videoId}
          opts={option}
          onReady={this.onReadyYouTube}
          onStateChange={this.onChangeYoutubeState}
        />
    </div>
    );
  }

}

export default YouTubeArtwork;
