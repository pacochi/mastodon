import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import classNames from 'classnames';
import { Canvas } from 'musicvideo-generator';
import { constructGeneratorOptions } from '../../util/musicvideo';

class Musicvideo extends ImmutablePureComponent {

  static propTypes = {
    track:  ImmutablePropTypes.map.isRequired,
    autoPlay: PropTypes.bool,
  };

  static defaultProps = {
    autoPlay: true,
  };

  state = {
    paused: true,
  }

  componentDidMount () {
    const { track } = this.props;

    const audioContext = new AudioContext;
    this.generator = new Canvas(audioContext, constructGeneratorOptions(track, track.getIn(['video', 'image'])));

    // オーディオ接続
    const { audioAnalyserNode } = this.generator;
    audioAnalyserNode.connect(audioContext.destination);
    this.audioAnalyser = audioAnalyserNode.context.createMediaElementSource(this.audioElement);
    this.audioAnalyser.connect(audioAnalyserNode);

    // キャンバス接続
    const { view } = this.generator.getRenderer();
    const { parent } = view;

    if (parent) {
      parent.removeChild(view);
    }

    this.canvasContainer.appendChild(view);
    this.generator.start();

    // シークバーのセットアップ
    this.seekbar.onchange = () => {
      const time = this.audioElement.duration * this.seekbar.value / 100;
      this.audioElement.currentTime = 0; // TODO: 過去にシークできなかった。今は消してもいいかも？
      this.audioElement.currentTime = time;
    };
    this.timer = setInterval(this.updateSeek, 500);
  }

  componentWillUnmount () {
    clearInterval(this.timer);

    if (this.generator) {
      this.generator.stop();
      this.generator.audioAnalyserNode.context.close();
    }

    if (this.audioAnalyser) {
      this.audioAnalyser.disconnect();
    }
  }

  updateSeek = () => {
    const audioElement = this.audioElement;

    if (audioElement) {
      if (!audioElement.paused  && !audioElement.seeking) {
        this.seekbar.value = 100 * this.audioElement.currentTime / this.audioElement.duration;
      }
    }
  }

  setAudioRef = (ref) => {
    this.audioElement = ref;
  }

  handleToggle = () => {
    const paused = this.audioElement.paused;
    this.setState({ paused: !paused });

    if (paused) {
      this.audioElement.play();
    } else {
      this.audioElement.pause();
    }
  }

  setCanvasContainerRef = (ref) => {
    this.canvasContainer = ref;
  }

  setSeekbarRef = (ref) => {
    this.seekbar = ref;
  }

  render() {
    const { track, autoPlay } = this.props;
    const { paused } = this.state;

    return (
      <div className='musicvideo'>
        <div className='canvas-container' ref={this.setCanvasContainerRef} />
        <audio autoPlay={autoPlay} ref={this.setAudioRef} src={track.get('music')} />
        <div className='controls'>
          <div className={classNames('toggle', { paused })} onClick={this.handleToggle} role='button' tabIndex='0' aria-pressed='false'>▶︎</div>
          <input className='seekbar' type='range' min='0' max='100' step='0.1' ref={this.setSeekbarRef} />
        </div>
      </div>
    );
  }

}

export default Musicvideo;
