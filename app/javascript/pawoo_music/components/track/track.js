import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import classNames from 'classnames';
import { Canvas } from 'musicvideo-generator';
import { constructGeneratorOptions } from '../../util/musicvideo';

import playIcon from '../../../images/pawoo_music/play.png';

class Track extends ImmutablePureComponent {

  static propTypes = {
    track:  ImmutablePropTypes.map,
  };

  state = {
    thumbnailView: true,
    paused: true,
  }

  componentDidMount () {
    const { track } = this.props;

    if (!track) {
      return;
    }

    this.timer = setInterval(this.updateSeek, 500);

    const audioContext = new AudioContext;
    this.generator = new Canvas(audioContext, constructGeneratorOptions(track, track.getIn(['video', 'image'])));
    this.generator.audioAnalyserNode.connect(audioContext.destination);
  }

  componentWillUnmount () {
    clearInterval(this.timer);

    if (this.generator) {
      this.generator.stop();
      this.generator.audioAnalyserNode.context.close();
    }

    this.setState({
      thumbnailView: false,
    });
  }

  updateSeek = () => {
    const audioElement = this.audioElement;

    if (audioElement) {
      if (!audioElement.paused  && !audioElement.seeking) {
        this.seekbar.value = 100 * this.audioElement.currentTime / this.audioElement.duration;
      }
    }
  }

  handlePlayClick = () => {
    const { thumbnailView } = this.state;
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

    const { view } = this.generator.getRenderer();
    const { parent } = view;

    if (parent) {
      parent.removeChild(view);
    }

    ref.appendChild(view);
    this.generator.start();
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

  handleToggle = () => {
    this.setState({ paused: !this.audioElement.paused });

    if(this.audioElement.paused) {
      this.audioElement.play();
    } else {
      this.audioElement.pause();
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
                <a className={classNames('toggle', { paused })} onClick={this.handleToggle}>▶︎</a>
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
