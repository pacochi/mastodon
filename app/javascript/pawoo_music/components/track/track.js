import React from 'react';
import ReactDOM from 'react-dom';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import classNames from 'classnames';
import { Canvas } from 'musicvideo-generator';
import { constructGeneratorOptions } from '../../util/musicvideo';

import playIcon from '../../../images/pawoo_music/play.png';

// たかしへ。 toggle の display を block にすると、そこのキャンバスが使えます。 お母さんより。
class Track extends ImmutablePureComponent {

  static propTypes = {
    track:  ImmutablePropTypes.map
  };

  state = {
    timer: null,
    thumbnailView: true,
    paused: true
  }

  componentDidMount () {
    const { track } = this.props;

    if (!track) {
      return;
    }

    let timer = setInterval(() => {this.seek(this.audioElement)}, 500);
    this.setState({timer: timer});

    const audioContext = new AudioContext;
    this.generator = new Canvas(audioContext, constructGeneratorOptions(track, track.getIn(['video', 'image'])));
    this.generator.audioAnalyserNode.connect(audioContext.destination);
  }

  componentWillUnmount () {
    clearInterval(this.state.timer);

    if (this.generator) {
      this.generator.stop();
      this.generator.audioAnalyserNode.context.close();
    }
  }

  handlePlayClick = () => {
    const { thumbnailView, timer } = this.state;
    this.setState({
      thumbnailView: !thumbnailView,
    });
  }

  handleAudioRef = (ref) => {
    if (!ref) {
      return;
    }

    this.audioElement = ref;
    const { audioAnalyserNode } = this.generator;


    if (this.audioNode) {
      this.audioNode.disconnect();
    }

    this.audioNode = audioAnalyserNode.context.createMediaElementSource(ref);
    this.audioNode.connect(audioAnalyserNode);
  }

  handleCanvasContainerRef = (ref) => {
    if (!ref) {
      return;
    }

    this.generator.start();
    const { view } = this.generator.getRenderer();
    const { parent } = view;


    if (parent) {
      parent.removeChild(view);
    }

    ref.appendChild(view);
  }

  handleSeekbarRef = (ref) => {
    if(!ref) {
      return;
    }

    this.seekbar = ref;

    this.seekbar.onchange = () => {
      let time = this.audioElement.duration * this.seekbar.value / 100;
      this.audioElement.currentTime = 0;
      this.audioElement.currentTime = time;
    };
  }

  toggle = () => {
    this.setState({paused: !this.audioElement.paused});

    if(this.audioElement.paused) {
      this.audioElement.play();
    } else {
      this.audioElement.pause();
    }
  }

  seek(audioElement) {
    if(audioElement) {
      if(!audioElement.paused  && !audioElement.seeking) {
        this.seekbar.value = 100 * this.audioElement.currentTime / this.audioElement.duration;
      }
    }
  }

  render() {
    const { track } = this.props;
    const { thumbnailView, paused } = this.state;
    if (!track) {
      return null;
    }

    return (
      <div className='track'>
        <div className='musicvideo'>
          {!thumbnailView ? (
            <div className='video'>
              <div className='canvas-container' ref={this.handleCanvasContainerRef} />
              <audio autoPlay ref={this.handleAudioRef} src={track.get('music')} />
              <div className='controls'>
                <a className={classNames('toggle', { paused })} onClick={this.toggle}>▶︎</a>
                <input className='seekbar' type='range' min='0' max='100' step='0.1' ref={this.handleSeekbarRef} />
              </div>
            </div>
          ) : (
            <div className='thumbnail'>
              <img className='albumart'   src={track.getIn(['video', 'image'])} alt='albumart' />
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
