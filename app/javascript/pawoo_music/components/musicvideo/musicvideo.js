import noop from 'lodash/noop';
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Canvas } from 'musicvideo-generator';
import IconButton from '../icon_button';
import Slider from '../slider';
import { constructGeneratorOptions } from '../../util/musicvideo';
import defaultArtwork from '../../../images/pawoo_music/default_artwork.png';

window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

const convertToURL = (file) => ((file instanceof File) ? URL.createObjectURL(file) : file);

class Musicvideo extends ImmutablePureComponent {

  static propTypes = {
    track: ImmutablePropTypes.map.isRequired,
    label: PropTypes.string,
    autoPlay: PropTypes.bool,
  };

  static defaultProps = {
    autoPlay: true,
  };

  state = {
    time: 0,
    music: convertToURL(this.props.track.get('music')),
    paused: true,
  };

  image = null;

  componentDidMount () {
    const { track } = this.props;

    // ジャケット画像
    this.image = new Image();
    this.image.addEventListener('load', this.updateCanvas, { once: false });
    this.image.crossOrigin = 'anonymous';
    this.image.src = convertToURL(track.getIn(['video', 'image'])) || defaultArtwork;

    // コンテキスト作成
    const audioContext = new AudioContext;
    this.generator = new Canvas(audioContext, constructGeneratorOptions(track, this.image));

    // オーディオ接続
    const { audioAnalyserNode } = this.generator;
    audioAnalyserNode.connect(audioContext.destination);
    this.audioAnalyser = audioAnalyserNode.context.createMediaElementSource(this.audioElement);
    this.audioAnalyser.connect(audioAnalyserNode);

    // キャンバス接続
    const { view } = this.generator.getRenderer();
    const { parent } = view;

    if (parent) parent.removeChild(view);

    this.canvasContainer.appendChild(view);
    this.generator.start();

    this.timer = setInterval(this.updateCurrentTime, 500);
  }

  componentWillReceiveProps ({ track }) {
    const music = track.get('music');
    const image = track.getIn(['video', 'image']);

    if (music !== this.props.track.get('music')) {
      this.setState({ music: convertToURL(music) });
    }

    if (image !== this.props.track.getIn(['video', 'image'])) {
      if (track.getIn(['video', 'image']) instanceof File) {
        URL.revokeObjectURL(this.image.src);
      }
      this.image.src = convertToURL(image) || defaultArtwork;
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

  handleTogglePaused = () => {
    const paused = this.audioElement.paused;
    this.setState({ paused: !paused });

    if (paused) {
      this.audioElement.play();
    } else {
      this.audioElement.pause();
    }
  }

  handleChangeCurrentTime = (value) => {
    const time = this.audioElement.duration * value / 100;
    this.audioElement.currentTime = 0; // TODO: 過去にシークできなかった。今は消してもいいかも？
    this.audioElement.currentTime = time;
    this.setState({ time: value });
  };

  setAudioRef = (ref) => {
    this.audioElement = ref;
  }

  setCanvasContainerRef = (ref) => {
    this.canvasContainer = ref;
  }

  updateCanvas = () => {
    this.generator.changeParams(constructGeneratorOptions(this.props.track, this.image));
  }

  updateCurrentTime = () => {
    const audioElement = this.audioElement;

    if (audioElement) {
      if (!audioElement.paused  && !audioElement.seeking) {
        this.setState({ time: 100 * this.audioElement.currentTime / this.audioElement.duration });
      }
    }
  }

  render() {
    const { autoPlay, label } = this.props;
    const { music, paused, time } = this.state;

    return (
      <div className='musicvideo'>
        <div className='canvas-container' ref={this.setCanvasContainerRef} aria-label={label} />
        <audio autoPlay={autoPlay} ref={this.setAudioRef} src={music} />
        <div className='controls'>
          <div className={classNames('toggle', { disabled: !music })} onClick={music ? this.handleTogglePaused : noop} role='button' tabIndex='0' aria-pressed='false'>
            {paused ? <IconButton src='play' /> : <IconButton src='pause' />}
          </div>
          <Slider
            min={0}
            max={100}
            step={0.1}
            value={time}
            onChange={this.handleChangeCurrentTime}
            disabled={!music}
            ref={this.setSeekbarRef}
          />
        </div>
      </div>
    );
  }

}

export default Musicvideo;
