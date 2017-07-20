import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

class SoundCloudArtwork extends React.PureComponent {

  static propTypes = {
    muted: PropTypes.bool.isRequired,
    volume: PropTypes.number.isRequired,
    timeOffset: PropTypes.number.isRequired,
    sourceId: PropTypes.string.isRequired,
  };

  scControl = null;

  componentDidMount () {
    this.scControl = SC.Widget(this.scRef);

    this.scControl.bind(SC.Widget.Events.READY, () => {
      this.scControl.bind(SC.Widget.Events.PLAY, () => {
        this.scControl.getCurrentSound(() => {
          this.setMuteOrVolume();
          const { timeOffset } = this.props;
          // SoundCloudはmilisecondsで、だいたいちょっと遅延するので+2ぐらいしとく
          this.scControl.seekTo((timeOffset + 2) * 1000);
        });
      });
    });
  }

  componentDidUpdate (prevProps) {
    const { muted, volume } = this.props;

    if (prevProps.muted !== muted || prevProps.volume !== volume) {
      this.setMuteOrVolume();
    }
  }

  componentWillUnmount () {
    this.scControl.unbind(SC.Widget.Events.READY);
    this.scControl.unbind(SC.Widget.Events.PLAY);
  }

  setMuteOrVolume () {
    const { muted, volume } = this.props;
    if (this.scControl) {
      this.scControl.setVolume(muted ? 0 : volume);
    }
  }

  setSCRef = (c) => {
    this.scRef = c;
  }

  render () {
    const { sourceId } = this.props;
    const params = {
      url: `https://api.soundcloud.com/tracks/${sourceId}`,
      auto_play: true,
      liking: false,
      show_playcount: false,
      show_bpm: false,
      sharing: false,
      buying: false,
      show_artwork: true,
      show_comments: false,
      visual: true,
    };

    return (
      <div className="queue-item__artwork">
        <iframe
          title={sourceId}
          ref={this.setSCRef}
          id="sc-widget"
          width="250"
          height="250"
          scrolling="no"
          frameBorder="no"
          src={`https://w.soundcloud.com/player/?${queryString.stringify(params)}`}
        />
    </div>
    );
  }

}

export default SoundCloudArtwork;
