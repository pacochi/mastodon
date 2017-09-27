import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import React from 'react';
import { Canvas } from 'albumart-video';
import { ChromePicker } from 'react-color';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import {
  focusTrackComposeBasicTab,
  focusTrackComposeVideoTab,
  changeTrackComposeTrackTitle,
  changeTrackComposeTrackArtist,
  changeTrackComposeTrackDescription,
  changeTrackComposeTrackMusic,
  changeTrackComposeTrackVideoImage,
  changeTrackComposeTrackVideoBlurVisibility,
  changeTrackComposeTrackVideoBlurParamMovementThreshold,
  changeTrackComposeTrackVideoBlurParamBlinkThreshold,
  changeTrackComposeTrackVideoParticleVisibility,
  changeTrackComposeTrackVideoParticleParamColor,
  changeTrackComposeTrackVideoParticleParamLimitThreshold,
  changeTrackComposeTrackVieoSpectrumVisiblity,
  changeTrackComposeTrackVideoSpectrumParamMode,
  changeTrackComposeTrackVideoSpectrumParamColor,
  submitTrackCompose,
} from '../../actions/track_compose';

const messages = defineMessages({
  preview: { id: 'track_compose.preview', defaultMessage: 'Video preview' },
});

function constructAlbumArtOptions(track, image) {
  const video = track.get('video');
  const blur = video.get('blur');
  const particle = video.get('particle');
  const spectrum = video.get('spectrum');

  const options = {
    image,
    text: { title: track.get('title'), sub: track.get('artist') },
  };

  if (blur.get('visible')) {
    options.blur = blur.get('params').toJS();
  }

  if (particle.get('visible')) {
    options.particle = particle.get('params').toJS();
  }

  if (spectrum.get('visible')) {
    options.spectrum = spectrum.get('params').toJS();
  }

  return options;
}

const mapStateToProps = (state) => ({
  tab: state.getIn(['pawoo_music', 'track_compose', 'tab']),
  track: state.getIn(['pawoo_music', 'track_compose', 'track']),
  isSubmitting: state.getIn(['pawoo_music', 'track_compose', 'is_submitting']),
});

const mapDispatchToProps = (dispatch) => ({
  onFocusBasicTab () {
    dispatch(focusTrackComposeBasicTab());
  },

  onFocusVideoTab () {
    dispatch(focusTrackComposeVideoTab());
  },

  onChangeTrackTitle (value) {
    dispatch(changeTrackComposeTrackTitle(value));
  },

  onChangeTrackArtist (value) {
    dispatch(changeTrackComposeTrackArtist(value));
  },

  onChangeTrackDescription (value) {
    dispatch(changeTrackComposeTrackDescription(value));
  },

  onChangeTrackMusic (value) {
    dispatch(changeTrackComposeTrackMusic(value));
  },

  onChangeTrackVideoImage (value) {
    dispatch(changeTrackComposeTrackVideoImage(value));
  },

  onChangeTrackVideoBlurVisibility (value) {
    dispatch(changeTrackComposeTrackVideoBlurVisibility(value));
  },

  onChangeTrackVideoBlurParamMovementThreshold (value) {
    dispatch(changeTrackComposeTrackVideoBlurParamMovementThreshold(value));
  },

  onChangeTrackVideoBlurParamBlinkThreshold (value) {
    dispatch(changeTrackComposeTrackVideoBlurParamBlinkThreshold(value));
  },

  onChangeTrackVideoParticleVisibility (value) {
    dispatch(changeTrackComposeTrackVideoParticleVisibility(value));
  },

  onChangeTrackVideoParticleParamColor (value) {
    dispatch(changeTrackComposeTrackVideoParticleParamColor(value));
  },

  onChangeTrackVideoParticleParamLimitThreshold (value) {
    dispatch(changeTrackComposeTrackVideoParticleParamLimitThreshold(value));
  },

  onChangeTrackVieoSpectrumVisiblity (value) {
    dispatch(changeTrackComposeTrackVieoSpectrumVisiblity(value));
  },

  onChangeTrackVideoSpectrumParamMode (value) {
    dispatch(changeTrackComposeTrackVideoSpectrumParamMode(value));
  },

  onChangeTrackVideoSpectrumParamColor (value) {
    dispatch(changeTrackComposeTrackVideoSpectrumParamColor(value));
  },

  onSubmit () {
    dispatch(submitTrackCompose());
  },
});

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
export default class TrackCompose extends ImmutablePureComponent {

  static propTypes = {
    onFocusBasicTab: PropTypes.func.isRequired,
    onFocusVideoTab: PropTypes.func.isRequired,
    onChangeTrackTitle: PropTypes.func.isRequired,
    onChangeTrackArtist: PropTypes.func.isRequired,
    onChangeTrackDescription: PropTypes.func.isRequired,
    onChangeTrackMusic: PropTypes.func.isRequired,
    onChangeTrackVideoImage: PropTypes.func.isRequired,
    onChangeTrackVideoBlurVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoBlurParamMovementThreshold: PropTypes.func.isRequired,
    onChangeTrackVideoBlurParamBlinkThreshold: PropTypes.func.isRequired,
    onChangeTrackVideoParticleVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoParticleParamColor: PropTypes.func.isRequired,
    onChangeTrackVideoParticleParamLimitThreshold: PropTypes.func.isRequired,
    onChangeTrackVieoSpectrumVisiblity: PropTypes.func.isRequired,
    onChangeTrackVideoSpectrumParamMode: PropTypes.func.isRequired,
    onChangeTrackVideoSpectrumParamColor: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    tab: PropTypes.string.isRequired,
    track: ImmutablePropTypes.map.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
  }

  constructor ({ track }) {
    const audioContext = new AudioContext;
    const music = track.get('music');
    const image = track.getIn(['video', 'image']);

    super();

    this.state = {
      music: music && URL.createObjectURL(music),
      image: image && URL.createObjectURL(image),
    };

    this.albumArt = new Canvas(audioContext, constructAlbumArtOptions(track, this.state.image));
    this.albumArt.audioAnalyserNode.connect(audioContext.destination);
    this.albumArt.start();
  }

  componentWillUnmount () {
    this.albumArt.stop();
    this.albumArt.audioAnalyserNode.context.close();
    URL.revokeObjectURL(this.state.music);
    URL.revokeObjectURL(this.state.image);
  }

  componentWillReceiveProps ({ track }) {
    const music = track.get('music');
    const image = track.getIn(['video', 'image']);

    if (music && music !== this.props.track.get('music')) {
      this.setState({ music: URL.createObjectURL(music) });
    }

    if (image && image !== this.props.track.getIn(['video', 'image'])) {
      this.setState({ image: URL.createObjectURL(image) });
    }
  }

  componentDidUpdate (_, { music, image }) {
    if (music !== this.state.music) {
      URL.revokeObjectURL(music);
    }

    if (image !== this.state.image) {
      URL.revokeObjectURL(image);
    }

    this.albumArt.changeParams(constructAlbumArtOptions(this.props.track, this.state.image));
  }

  handleCanvasContainerRef = (ref) => {
    const { view } = this.albumArt.getRenderer();
    const { parent } = view;

    if (!ref) {
      return;
    }

    if (parent) {
      parent.removeChild(view);
    }

    ref.appendChild(view);
  }

  handleAudioRef = (ref) => {
    const { audioAnalyserNode } = this.albumArt;

    if (!ref) {
      return;
    }

    if (this.audioNode) {
      this.audioNode.disconnect();
    }

    this.audioNode = audioAnalyserNode.context.createMediaElementSource(ref);
    this.audioNode.connect(audioAnalyserNode);
  }

  handleChangeTrackMusic = ({ target }) => {
    this.props.onChangeTrackMusic(target.files[0]);
  }

  handleChangeTrackTitle = ({ target }) => {
    this.props.onChangeTrackTitle(target.value);
  }

  handleChangeTrackArtist = ({ target }) => {
    this.props.onChangeTrackArtist(target.value);
  }

  handleChangeTrackDescription = ({ target }) => {
    this.props.onChangeTrackDescription(target.value);
  }

  handleChangeTrackVideoImage = ({ target }) => {
    this.props.onChangeTrackVideoImage(target.files[0]);
  }

  handleChangeTrackVideoBlurVisibility = ({ target }) => {
    this.props.onChangeTrackVideoBlurVisibility(target.checked);
  }

  handleChangeTrackBlurParamMovementThreshold = ({ target }) => {
    this.props.onChangeTrackVideoImage(target.value);
  }

  handleChangeTrackVideoBlurParamBlinkThreshold = ({ target }) => {
    this.props.onChangeTrackVideoBlurParamBlinkThreshold(target.value);
  }

  handleChangeTrackVideoParticleVisibility = ({ target }) => {
    this.props.onChangeTrackVideoParticleVisibility(target.checked);
  }

  handleChangeTrackVideoParticleParamLimitThreshold = ({ target }) => {
    this.props.onChangeTrackVideoParticleParamLimitThreshold(target.value);
  }

  handleChangeTrackVideoParticleParamColor = ({ rgb }) => {
    this.props.onChangeTrackVideoParticleParamColor((rgb.r << 16) | (rgb.g << 8) | rgb.b);
  }

  handleChangeTrackVideoSpectrumVisibility = ({ target }) => {
    this.props.onChangeTrackVideoSpectrumVisibility(target.checked);
  }

  handleChangeTrackVideoSpectrumParamMode = ({ target }) => {
    if (target.checked) {
      this.props.onChangeTrackVideoSpectrumParamMode(Number(target.value));
    }
  }

  handleChangeTrackVideoSpectrumParamColor = ({ rgb }) => {
    this.props.onChangeTrackVideoSpectrumParamColor((rgb.r << 16) | (rgb.g << 8) | rgb.b);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit();
  }

  render () {
    return (
      <div>
        <div role='tablist'>
          <button
            id='pawoo-music-basic-tab'
            aria-controls='pawoo-music-basic-tabpanel'
            role='tab'
            onClick={this.props.onFocusBasicTab}
          >
            <FormattedMessage
               id='pawoo_music.track_compose.basic'
               defaultMessage='Basic'
            />
          </button>
          <button
            id='pawoo-music-video-tab'
            aria-controls='pawoo-music-video-tabpanel'
            role='tab'
            onClick={this.props.onFocusVideoTab}
          >
            <FormattedMessage
              id='pawoo_music.track_compose.video'
              defaultMessage='Video'
            />
          </button>
        </div>
        <div className='track-compose'>
          <div className='video'>
            <div
              aria-label={this.props.intl.formatMessage(messages.preview)}
              className='canvas-container'
              ref={this.handleCanvasContainerRef}
            />
            <audio controls ref={this.handleAudioRef} src={this.state.music} />
          </div>
          <form>
            <fieldset
              id='pawoo-music-basic-tabpanel'
              aria-expanded={(this.props.tab === 'basic').toString()}
              aria-labelledby='pawoo-music-basic-tab'
              style={{ display: this.props.tab === 'basic' || 'none' }}
            >
              <label>
                <span className='text'>
                  <FormattedMessage
                    id='pawoo_music.track_compose.basic.music'
                    defaultMessage='Audio'
                  />
                </span>
                <input
                  accept='audio/mpeg'
                  onChange={this.handleChangeTrackMusic}
                  required
                  type='file'
                />
              </label>
              <label>
                <span className='text'>
                  <FormattedMessage
                    id='pawoo_music.track_compose.basic.title'
                    defaultMessage='Title'
                  />
                </span>
                <input
                  maxLength='128'
                  onChange={this.handleChangeTrackTitle}
                  required
                  size='32'
                  value={this.props.track.get('title')}
                />
              </label>
              <label>
                <span className='text'>
                  <FormattedMessage
                    id='pawoo_music.track_compose.basic.artist'
                    defaultMessage='Artist'
                  />
                </span>
                <input
                  maxLength='128'
                  onChange={this.handleChangeTrackArtist}
                  required
                  size='32'
                  value={this.props.track.get('artist')}
                />
              </label>
              <label>
                <span className='text'>
                  <FormattedMessage
                    id='pawoo_music.track_compose.basic.details'
                    defaultMessage='Details'
                  />
                </span>
                <textarea
                  maxLength='500'
                  onChange={this.handleChangeTrackDescription}
                  value={this.props.track.get('description')}
                />
              </label>
            </fieldset>
            <fieldset
              id='pawoo-music-video-tabpanel'
              aria-expanded={(this.props.tab === 'video').toString()}
              aria-labelledby='pawoo-music-video-tab'
              style={{ display: this.props.tab === 'video' || 'none' }}
            >
              <label>
                <span className='text'>
                  <FormattedMessage
                    id='pawoo_music.track_compose.video.image'
                    defaultMessage='Image'
                  />
                </span>
                <input
                  accept='image/jpeg,image/png'
                  onChange={this.handleChangeTrackVideoImage}
                  type='file'
                />
              </label>
              <fieldset>
                <legend>
                  <label>
                    <input
                      checked={this.props.track.getIn(['video', 'blur', 'visible'])}
                      onChange={this.handleChangeTrackVideoBlurVisibility}
                      type='checkbox'
                    />
                    <FormattedMessage
                      id='pawoo_music.track_compose.video.blur'
                      defaultMessage='Blur'
                    />
                  </label>
                </legend>
                <label>
                  <span className='text'>
                    <FormattedMessage
                      id='pawoo_music.track_compose.video.movement_threshold'
                      defaultMessage='Threshold triggering movement'
                    />
                  </span>
                  <input
                    min='128'
                    max='256'
                    onClick={this.handleChangeTrackBlurParamMovementThreshold}
                    type='range'
                    value={this.props.track.getIn(['video', 'blur', 'params', 'movement', 'threshold'])}
                  />
                </label>
                <label>
                  <span className='text'>
                    <FormattedMessage
                      id='pawoo_music.track_compose.video.blink_threshold'
                      defaultMessage='Threshold triggering blink'
                    />
                  </span>
                  <input
                    min='128'
                    max='256'
                    onClick={this.handleChangeTrackVideoBlurParamBlinkThreshold}
                    type='range'
                    value={this.props.track.getIn(['video', 'blur', 'params', 'blink', 'threshold'])}
                  />
                </label>
              </fieldset>
              <fieldset>
                <legend>
                  <label>
                    <input
                      checked={this.props.track.getIn(['video', 'particle', 'visible'])}
                      onChange={this.handleChangeTrackVideoParticleVisibility}
                      type='checkbox'
                    />
                    <FormattedMessage
                      id='pawoo_music.track_compose.video.particle'
                      defaultMessage='Particle'
                    />
                  </label>
                </legend>
                <label>
                  <span className='text'>
                    <FormattedMessage
                      id='pawoo_music.track_compose.video.limit_threshold'
                      defaultMessage='Threshold triggering change'
                    />
                  </span>
                  <input
                    min='128'
                    max='256'
                    onClick={this.handleChangeTrackVideoParticleParamLimitThreshold}
                    type='range'
                    value={this.props.track.getIn(['video', 'particle', 'params', 'limit', 'threshold'])}
                  />
                </label>
                <ChromePicker
                  color={this.props.track.getIn(['video', 'particle', 'params', 'color'])}
                  disableAlpha
                  onChange={this.handleChangeTrackVideoParticleParamColor}
                />
              </fieldset>
              <fieldset>
                <legend>
                  <label>
                    <input
                      checked={this.props.track.getIn(['video', 'spectrum', 'visible'])}
                      onChange={this.handleChangeTrackVideoSpectrumVisibility}
                      type='checkbox'
                    />
                    <FormattedMessage
                      id='pawoo_music.track_compose.video.spectrum'
                      defaultMessage='Spectrum'
                    />
                  </label>
                </legend>
                <fieldset>
                  <FormattedMessage
                    id='pawoo_music.track_compose.video.mode'
                    defaultMessage='Mode'
                  />
                  <label>
                    <input
                      checked={this.props.track.getIn(['video', 'spectrum', 'params', 'mode']) === 0}
                      name='video-spectrum-mode'
                      onClick={this.handleChangeTrackVideoSpectrumParamMode}
                      type='radio'
                      value='0'
                    />
                    <FormattedMessage
                      id='pawoo_music.track_compose.video.bottom_columns'
                      defaultMessage='Columns at the bottom'
                    />
                  </label>
                  <label>
                    <input
                      checked={this.props.track.getIn(['video', 'spectrum', 'params', 'mode']) === 1}
                      name='video-spectrum-mode'
                      onChange={this.handleChangeTrackVideoSpectrumParamMode}
                      type='radio'
                      value='1'
                    />
                    <FormattedMessage
                      id='pawoo_music.track_compose.video.circle_columns'
                      defaultMessage='Columns around circle'
                    />
                  </label>
                  <label>
                    <input
                      checked={this.props.track.getIn(['video', 'spectrum', 'params', 'mode']) === 2}
                      name='video-spectrum-mode'
                      onChange={this.handleChangeTrackVideoSpectrumParamMode}
                      type='radio'
                      value='2'
                    />
                    <FormattedMessage
                      id='pawoo_music.track_compose.video.circle'
                      defaultMessage='Circle'
                    />
                  </label>
                  <label>
                    <input
                      checked={this.props.track.getIn(['video', 'spectrum', 'params', 'mode']) === 3}
                      name='video-spectrum-mode'
                      onChange={this.handleChangeTrackVideoSpectrumParamMode}
                      type='radio'
                      value='3'
                    />
                    <FormattedMessage
                      id='pawoo_music.track_compose.video.bottom_fill'
                      defaultMessage='Filled graph at the bottom'
                    />
                  </label>
                </fieldset>
                <ChromePicker
                  color={this.props.track.getIn(['video', 'spectrum', 'params', 'color'])}
                  disableAlpha
                  onChange={this.handleChangeTrackVideoSpectrumParamColor}
                />
              </fieldset>
            </fieldset>
            <button
              disabled={this.props.isSubmitting}
              onClick={this.handleSubmit}
            >
              <FormattedMessage
                id='pawoo_music.track_compose.save'
                defaultMessage='Save'
              />
            </button>
          </form>
        </div>
      </div>
    );
  }

}
