import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import classNames from 'classnames';
import { Canvas } from 'musicvideo-generator';
import { constructGeneratorOptions } from '../../util/musicvideo';

import defaultArtwork from '../../../images/pawoo_music/default_artwork.png';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

function convertURL(file) {
  if (file instanceof File) {
    return URL.createObjectURL(file);
  } else {
    return file;
  }
}

class Musicvideo extends ImmutablePureComponent {

  static propTypes = {
    track: ImmutablePropTypes.map.isRequired,
    autoPlay: PropTypes.bool,
    label: PropTypes.string,
  };

  static defaultProps = {
    autoPlay: true,
  };

  state = {
    paused: true,
    music: convertURL(this.props.track.get('music')),
  }

  constructor(props) {
    super(props);

    this.image = new Image;
    this.image.crossOrigin = 'anonymous';
    this.image.src = convertURL(props.track.getIn(['video', 'image'])) || defaultArtwork;
  }

  componentDidMount () {
    const { track } = this.props;

    const audioContext = new AudioContext;
    this.generator = new Canvas(audioContext, constructGeneratorOptions(track, this.image));
    this.image.addEventListener('load', this.updateCanvas, { once: false });

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

  componentWillReceiveProps ({ track }) {
    const music = track.get('music');
    const image = track.getIn(['video', 'image']);

    if (music !== this.props.track.get('music')) {
      this.setState({ music: convertURL(music) });
    }

    if (image !== this.props.track.getIn(['video', 'image'])) {
      if (track.getIn(['video', 'image']) instanceof File) {
        URL.revokeObjectURL(this.image.src);
      }

      this.image.src = convertURL(image) || defaultArtwork;
    }
  }

  componentDidUpdate ({ track }, { music }) {
    if ((track.get('music') instanceof File) && music !== this.state.music) {
      URL.revokeObjectURL(music);
    }

    this.updateCanvas();
  }

  componentWillUnmount () {
    const { track } = this.props;
    const { music } = this.state;

    clearInterval(this.timer);

    if (this.generator) {
      this.generator.stop();
      this.generator.audioAnalyserNode.context.close();
    }

    if (this.audioAnalyser) {
      this.audioAnalyser.disconnect();
    }

    if ((track.get('music') instanceof File)) {
      URL.revokeObjectURL(music);
    }

    if ((track.getIn(['video', 'image']) instanceof File)) {
      URL.revokeObjectURL(this.image.src);
    }
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

  setAudioRef = (ref) => {
    this.audioElement = ref;
  }

  setCanvasContainerRef = (ref) => {
    this.canvasContainer = ref;
  }

  setSeekbarRef = (ref) => {
    this.seekbar = ref;
  }

  updateCanvas = () => {
    this.generator.changeParams(constructGeneratorOptions(this.props.track, this.image));
  }

  updateSeek = () => {
    const audioElement = this.audioElement;

    if (audioElement) {
      if (!audioElement.paused  && !audioElement.seeking) {
        this.seekbar.value = 100 * this.audioElement.currentTime / this.audioElement.duration;
      }
    }
  }

  render() {
    const { autoPlay, label } = this.props;
    const { music, paused } = this.state;

    return (
      <div className='musicvideo'>
        <div className='canvas-container' ref={this.setCanvasContainerRef} aria-label={label} />
        <audio autoPlay={autoPlay} ref={this.setAudioRef} src={music} />
        <div className='controls'>
          <div className={classNames('toggle', { paused })} onClick={this.handleToggle} role='button' tabIndex='0' aria-pressed='false'>▶︎</div>
          <input className='seekbar' type='range' min='0' max='100' step='0.1' ref={this.setSeekbarRef} />
        </div>
      </div>
    );
  }

}

export default Musicvideo;
