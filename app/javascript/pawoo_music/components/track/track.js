import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Canvas } from 'musicvideo-generator';
import { constructGeneratorOptions } from '../../util/musicvideo';

import playIcon from '../../../images/pawoo_music/play.png';

// たかしへ。 toggle の display を block にすると、そこのキャンバスが使えます。 お母さんより。
class Track extends ImmutablePureComponent {

  static propTypes = {
    track: ImmutablePropTypes.map,
  }

  state = {
    isPlay: false,
  }

  componentDidMount () {
    const { track } = this.props;

    if (!track) {
      return;
    }

    const audioContext = new AudioContext;
    this.generator = new Canvas(audioContext, constructGeneratorOptions(track, track.getIn(['video', 'image'])));
    this.generator.audioAnalyserNode.connect(audioContext.destination);
  }

  componentWillUnmount () {
    if (this.generator) {
      this.generator.stop();
      this.generator.audioAnalyserNode.context.close();
    }
  }

  handlePlayClick = () => {
    const { isPlay } = this.state;
    this.setState({
      isPlay: !isPlay,
    });
  }

  handleAudioRef = (ref) => {
    const { audioAnalyserNode } = this.generator;

    if (!ref) {
      return;
    }

    if (this.audioNode) {
      this.audioNode.disconnect();
    }

    this.audioNode = audioAnalyserNode.context.createMediaElementSource(ref);
    this.audioNode.connect(audioAnalyserNode);
  }

  handleCanvasContainerRef = (ref) => {
    this.generator.start();
    const { view } = this.generator.getRenderer();
    const { parent } = view;

    if (!ref) {
      return;
    }

    if (parent) {
      parent.removeChild(view);
    }

    ref.appendChild(view);
  }

  render() {
    const { track } = this.props;
    const { isPlay } = this.state;

    if (!track) {
      return null;
    }

    return (
      <div className='track'>
        <div className='musicvideo'>
          {isPlay ? (
            <div className='video'>
              <div className='canvas-container' ref={this.handleCanvasContainerRef} />
              <audio autoPlay controls ref={this.handleAudioRef} src={track.get('music')} />
            </div>
          ) : (
            <div className='thumbnail'>
              <img src={track.getIn(['video', 'image'])} alt='albumart' />
              <img className='playbutton' src={playIcon} alt='playbutton' role='button' tabIndex='0' aria-pressed='false' onClick={this.handlePlayClick} />
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
