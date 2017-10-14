import classNames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import React from 'react';
import { SketchPicker } from 'react-color';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import {
  changeTrackComposeTrackTitle,
  changeTrackComposeTrackArtist,
  changeTrackComposeTrackText,
  changeTrackComposeTrackMusic,
  changeTrackComposeTrackVideoImage,
  changeTrackComposeTrackVideoBlurVisibility,
  changeTrackComposeTrackVideoBlurParamMovementThreshold,
  changeTrackComposeTrackVideoBlurParamBlinkThreshold,
  changeTrackComposeTrackVideoParticleVisibility,
  changeTrackComposeTrackVideoParticleParamAlpha,
  changeTrackComposeTrackVideoParticleParamColor,
  changeTrackComposeTrackVideoParticleParamLimitThreshold,
  changeTrackComposeTrackVideoLightLeaksVisibility,
  changeTrackComposeTrackVideoLightLeaksParamAlpha,
  changeTrackComposeTrackVideoLightLeaksParamInterval,
  changeTrackComposeTrackVideoSpectrumVisiblity,
  changeTrackComposeTrackVideoSpectrumParamMode,
  changeTrackComposeTrackVideoSpectrumParamAlpha,
  changeTrackComposeTrackVideoSpectrumParamColor,
  changeTrackComposeTrackVideoTextVisibility,
  changeTrackComposeTrackVideoTextParamAlpha,
  changeTrackComposeTrackVideoTextParamColor,
  submitTrackCompose,
} from '../../actions/track_compose';
import IconButton from '../../components/icon_button';
import Musicvideo from '../../components/musicvideo';
import Delay from '../../components/delay';
import Slider from '../../components/slider';
import {
  constructRgbObject,
  constructRgbCode,
  extractRgbFromRgbObject,
  validateIsFileMp3,
  validateIsFileImage,
} from '../../util/musicvideo';

const messages = defineMessages({
  preview: { id: 'pawoo_music.track_compose.preview', defaultMessage: 'Video preview' },
});

const mapStateToProps = (state) => ({
  tab: state.getIn(['pawoo_music', 'track_compose', 'tab']),
  track: state.getIn(['pawoo_music', 'track_compose', 'track']),
  error: state.getIn(['pawoo_music', 'track_compose', 'error']),
  isSubmitting: state.getIn(['pawoo_music', 'track_compose', 'is_submitting']),
});

const mapDispatchToProps = (dispatch) => ({
  onChangeTrackTitle (value) {
    dispatch(changeTrackComposeTrackTitle(value));
  },

  onChangeTrackArtist (value) {
    dispatch(changeTrackComposeTrackArtist(value));
  },

  onChangeTrackText (value) {
    dispatch(changeTrackComposeTrackText(value));
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

  onChangeTrackVideoParticleParamAlpha (value) {
    dispatch(changeTrackComposeTrackVideoParticleParamAlpha(value));
  },

  onChangeTrackVideoParticleParamColor (value) {
    dispatch(changeTrackComposeTrackVideoParticleParamColor(value));
  },

  onChangeTrackVideoParticleParamLimitThreshold (value) {
    dispatch(changeTrackComposeTrackVideoParticleParamLimitThreshold(value));
  },

  onChangeTrackVideoLightLeaksVisibility (value) {
    dispatch(changeTrackComposeTrackVideoLightLeaksVisibility(value));
  },

  onChangeTrackVideoLightLeaksParamAlpha (value) {
    dispatch(changeTrackComposeTrackVideoLightLeaksParamAlpha(value));
  },

  onChangeTrackVideoLightLeaksParamInterval (value) {
    dispatch(changeTrackComposeTrackVideoLightLeaksParamInterval(value));
  },

  onChangeTrackVideoSpectrumVisibility (value) {
    dispatch(changeTrackComposeTrackVideoSpectrumVisiblity(value));
  },

  onChangeTrackVideoSpectrumParamMode (value) {
    dispatch(changeTrackComposeTrackVideoSpectrumParamMode(value));
  },

  onChangeTrackVideoSpectrumParamAlpha (value) {
    dispatch(changeTrackComposeTrackVideoSpectrumParamAlpha(value));
  },

  onChangeTrackVideoSpectrumParamColor (value) {
    dispatch(changeTrackComposeTrackVideoSpectrumParamColor(value));
  },

  onChangeTrackComposeTrackVideoTextVisibility (value) {
    dispatch(changeTrackComposeTrackVideoTextVisibility(value));
  },

  onChangeTrackComposeTrackVideoTextParamAlpha (value) {
    dispatch(changeTrackComposeTrackVideoTextParamAlpha(value));
  },

  onChangeTrackComposeTrackVideoTextParamColor (value) {
    dispatch(changeTrackComposeTrackVideoTextParamColor(value));
  },

  onSubmit () {
    dispatch(submitTrackCompose());
  },
});

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
export default class TrackCompose extends ImmutablePureComponent {

  static propTypes = {
    onChangeTrackTitle: PropTypes.func.isRequired,
    onChangeTrackArtist: PropTypes.func.isRequired,
    onChangeTrackText: PropTypes.func.isRequired,
    onChangeTrackMusic: PropTypes.func.isRequired,
    onChangeTrackVideoImage: PropTypes.func.isRequired,
    onChangeTrackVideoBlurVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoBlurParamMovementThreshold: PropTypes.func.isRequired,
    onChangeTrackVideoBlurParamBlinkThreshold: PropTypes.func.isRequired,
    onChangeTrackVideoParticleVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoParticleParamAlpha: PropTypes.func.isRequired,
    onChangeTrackVideoParticleParamColor: PropTypes.func.isRequired,
    onChangeTrackVideoParticleParamLimitThreshold: PropTypes.func.isRequired,
    onChangeTrackVideoLightLeaksVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoLightLeaksParamAlpha: PropTypes.func.isRequired,
    onChangeTrackVideoLightLeaksParamInterval: PropTypes.func.isRequired,
    onChangeTrackVideoSpectrumVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoSpectrumParamMode: PropTypes.func.isRequired,
    onChangeTrackVideoSpectrumParamAlpha: PropTypes.func.isRequired,
    onChangeTrackVideoSpectrumParamColor: PropTypes.func.isRequired,
    onChangeTrackComposeTrackVideoTextVisibility: PropTypes.func.isRequired,
    onChangeTrackComposeTrackVideoTextParamAlpha: PropTypes.func.isRequired,
    onChangeTrackComposeTrackVideoTextParamColor: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    tab: PropTypes.string.isRequired,
    track: ImmutablePropTypes.map.isRequired,
    error: PropTypes.any,
    isSubmitting: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  }

  static defaultProps = {
    onClose: false,
  }

  state = {
    trackMusicTitle: '',
    trackVideoImageTitle: '',
    visibleColorPicker: null,
  };

  trackMusicRef = null;
  trackVideoImageRef = null;

  componentWillReceiveProps ({ error, isSubmitting, track }) {
    if (track.get('music') === null && this.props.track.get('music') !== null &&
        this.trackMusicRef !== null) {
      this.trackMusicRef.value = '';
    }

    if (track.getIn(['video', 'image']) === null &&
        this.props.track.getIn(['video', 'image']) !== null &&
        this.trackVideoImageRef !== null) {
      this.trackVideoImageRef.value = '';
    }

    // アップロードに成功した
    if (this.props.isSubmitting && !isSubmitting && !error) {
      this.handleCancel();
    }
  }

  handleChangeTrackMusic = ({ target }) => {
    const file = target.files[0];
    if (file) {
      validateIsFileMp3(file).then((isMp3) => {
        if (isMp3) {
          this.setState({ trackMusicTitle: file.name }, () => {
            this.props.onChangeTrackMusic(file);
          });
        }
      });
    }
  };

  handleChangeTrackTitle = ({ target }) => {
    this.props.onChangeTrackTitle(target.value);
  }

  handleChangeTrackArtist = ({ target }) => {
    this.props.onChangeTrackArtist(target.value);
  }

  handleChangeTrackText = ({ target }) => {
    this.props.onChangeTrackText(target.value);
  }

  handleChangeTrackVideoImage = ({ target }) => {
    const file = target.files[0];
    if (file) {
      validateIsFileImage(file).then((isImage) => {
        if (isImage) {
          this.setState({ trackVideoImageTitle: file.name }, () => {
            this.props.onChangeTrackVideoImage(file);
          });
        }
      });
    }
  }

  handleChangeTrackVideoBlurVisibility = ({ target }) => {
    this.props.onChangeTrackVideoBlurVisibility(target.checked);
  }

  handleChangeTrackBlurParamMovementThreshold = (value) => {
    this.props.onChangeTrackVideoBlurParamMovementThreshold(value);
  }

  handleChangeTrackVideoBlurParamBlinkThreshold = (value) => {
    this.props.onChangeTrackVideoBlurParamBlinkThreshold(value);
  }

  handleChangeTrackVideoParticleVisibility = ({ target }) => {
    this.props.onChangeTrackVideoParticleVisibility(target.checked);
  }

  handleChangeTrackVideoParticleParamLimitThreshold = (value) => {
    this.props.onChangeTrackVideoParticleParamLimitThreshold(value);
  }

  handleChangeTrackVideoParticleParamColor = ({ rgb }) => {
    this.props.onChangeTrackVideoParticleParamAlpha(rgb.a);
    this.props.onChangeTrackVideoParticleParamColor(extractRgbFromRgbObject(rgb));
  }

  handleChangeTrackVideoLightLeaksVisibility = ({ target }) => {
    this.props.onChangeTrackVideoLightLeaksVisibility(target.checked);
  }

  handleChangeTrackVideoLightLeaksParamAlpha = (value) => {
    this.props.onChangeTrackVideoLightLeaksParamAlpha(value);
  }

  handleChangeTrackVideoLightLeaksParamInterval = (value) => {
    this.props.onChangeTrackVideoLightLeaksParamInterval(value);
  }

  handleChangeTrackVideoLightLeaksParamColor = ({ rgb }) => {
    this.props.onChangeTrackVideoLightLeaksParamAlpha(rgb.a);
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
    this.props.onChangeTrackVideoSpectrumParamAlpha(rgb.a);
    this.props.onChangeTrackVideoSpectrumParamColor(extractRgbFromRgbObject(rgb));
  }

  handleChangeTrackComposeTrackVideoTextVisibility = ({ target }) => {
    this.props.onChangeTrackComposeTrackVideoTextVisibility(target.checked);
  }

  handleChangeTrackComposeTrackVideoTextParamColor = ({ rgb }) => {
    this.props.onChangeTrackComposeTrackVideoTextParamAlpha(rgb.a);
    this.props.onChangeTrackComposeTrackVideoTextParamColor(extractRgbFromRgbObject(rgb));
  }

  handleToggleParticleColorPickerVisible = () => {
    this.setState({ visibleColorPicker: this.state.visibleColorPicker === 'particle' ? null : 'particle' });
  };

  handleToggleSpectrumColorPickerVisible = () => {
    this.setState({ visibleColorPicker: this.state.visibleColorPicker === 'spectrum' ? null : 'spectrum' });
  };

  handleToggleTextColorPickerVisible = () => {
    this.setState({ visibleColorPicker: this.state.visibleColorPicker === 'text' ? null : 'text' });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit();
  }

  handleCancel = () => {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    } else {
      location.href = '/';
    }
  }

  setTrackMusicRef = (ref) => {
    this.trackMusicRef = ref;
  }

  setTrackVideoImageRef = (ref) => {
    this.trackVideoImageRef = ref;
  }

  render () {
    const { track } = this.props;
    const { trackMusicTitle, trackVideoImageTitle } = this.state;

    return (
      <div className='track-compose'>
        <div className='content'>
          <Musicvideo track={track} label={this.props.intl.formatMessage(messages.preview)} autoPlay={false} />
          <div className='form-content'>
            <form>

              {/* 音楽選択から画像選択まで */}
              <fieldset>
                <legend>
                  <div className={classNames('track-compose-file-upload', { settled: track.get('music') instanceof File })}>
                    <div className='track-compose-file-upload-body'>
                      <label className='horizontal'>
                        <IconButton src='music' />
                        <span className='text'>
                          {trackMusicTitle ? trackMusicTitle : (
                            <FormattedMessage
                              id='pawoo_music.track_compose.basic.music'
                              defaultMessage='Select audio'
                            />
                          )}
                        </span>
                        <input
                          accept='audio/mpeg'
                          onChange={this.handleChangeTrackMusic}
                          ref={this.setTrackMusicRef}
                          required
                          type='file'
                        />
                      </label>
                    </div>
                  </div>
                </legend>

                <legend>
                  <div className='track-compose-text-input'>
                    <label className='horizontal'>
                      {this.props.track.get('title').length === 0 && (
                        <span className='text'>
                          <FormattedMessage
                            id='pawoo_music.track_compose.basic.title'
                            defaultMessage='Title'
                          />
                        </span>
                      )}
                      <input
                        maxLength='128'
                        onChange={this.handleChangeTrackTitle}
                        required
                        size='32'
                        type='text'
                        value={this.props.track.get('title')}
                      />
                    </label>
                  </div>
                </legend>

                <legend>
                  <div className='track-compose-text-input'>
                    <label className='horizontal'>
                      {this.props.track.get('artist').length === 0 && (
                        <span className='text'>
                          <FormattedMessage
                            id='pawoo_music.track_compose.basic.artist'
                            defaultMessage='Artist'
                          />
                        </span>
                      )}
                      <input
                        maxLength='128'
                        onChange={this.handleChangeTrackArtist}
                        required
                        size='32'
                        type='text'
                        value={this.props.track.get('artist')}
                      />
                    </label>
                  </div>
                </legend>

                <legend>
                  <div className='track-compose-text-textarea'>
                    <label className='horizontal'>
                      {this.props.track.get('text').length === 0 && (
                        <span className='text'>
                          <FormattedMessage
                            id='pawoo_music.track_compose.basic.details'
                            defaultMessage='Details'
                          />
                        </span>
                      )}
                      <textarea
                        maxLength='500'
                        onChange={this.handleChangeTrackText}
                        value={this.props.track.get('text')}
                      />
                    </label>
                  </div>
                </legend>

                <legend>
                  <div className={classNames('track-compose-file-upload', { settled: track.getIn(['video', 'image']) instanceof File })}>
                    <div className='track-compose-file-upload-body'>
                      <label className='horizontal'>
                        <IconButton src='image' />
                        <span className='text'>
                          {trackVideoImageTitle ? trackVideoImageTitle : (
                            <FormattedMessage
                              id='pawoo_music.track_compose.video.image'
                              defaultMessage='Image'
                            />
                          )}
                        </span>
                        <input
                          accept='image/jpeg,image/png'
                          onChange={this.handleChangeTrackVideoImage}
                          ref={this.setTrackVideoImageRef}
                          type='file'
                        />
                      </label>
                    </div>
                  </div>
                </legend>
              </fieldset>

              {/* Spectrum */}
              <fieldset>
                <legend>
                  <label className='horizontal'>
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

                <legend className='track-compose-effect'>
                  <div className='horizontal'>
                    <span className='text'>
                      <FormattedMessage
                        id='pawoo_music.track_compose.video.spectrum_mode'
                        defaultMessage='Threshold triggering change'
                      />
                    </span>
                    <div className='horizontal'>
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
                          checked={this.props.track.getIn(['video', 'spectrum', 'params', 'mode']) === 0}
                          name='video-spectrum-mode'
                          onChange={this.handleChangeTrackVideoSpectrumParamMode}
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
                    </div>
                  </div>

                  <div className='track-compose-effect-color'>
                    <label className='horizontal'>
                      <span className='text'>
                        <FormattedMessage
                          id='pawoo_music.track_compose.video.color'
                          defaultMessage='Color'
                        />
                      </span>
                      <div className='track-compose-effect-color-wrap'>
                        <div className='track-compose-effect-color-trigger' onClick={this.handleToggleSpectrumColorPickerVisible} role='button' tabIndex='-1'>
                          <div className='track-compose-effect-color-trigger-body' style={{ backgroundColor: constructRgbCode(this.props.track.getIn(['video', 'spectrum', 'params', 'color']), this.props.track.getIn(['video', 'spectrum', 'params', 'alpha'])) }} />
                        </div>
                        <Delay>
                          {this.state.visibleColorPicker === 'spectrum' && (
                            <div className='track-compose-effect-color-content'>
                              <SketchPicker
                                color={constructRgbObject(this.props.track.getIn(['video', 'spectrum', 'params', 'color']), this.props.track.getIn(['video', 'spectrum', 'params', 'alpha']))}
                                onChange={this.handleChangeTrackVideoSpectrumParamColor}
                              />
                            </div>
                          )}
                        </Delay>
                      </div>
                    </label>
                  </div>
                </legend>
              </fieldset>

              {/* Blur */}
              <fieldset>
                <legend>
                  <label className='horizontal'>
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

                <legend className='track-compose-effect'>
                  <label className='horizontal'>
                    <span className='text'>
                      <FormattedMessage
                        id='pawoo_music.track_compose.video.movement_threshold'
                        defaultMessage='Threshold triggering movement'
                      />
                    </span>
                    <Slider
                      min={128}
                      max={256}
                      value={this.props.track.getIn(['video', 'blur', 'params', 'movement', 'threshold'])}
                      onChange={this.handleChangeTrackBlurParamMovementThreshold}
                    />
                  </label>
                  <label className='horizontal'>
                    <span className='text'>
                      <FormattedMessage
                        id='pawoo_music.track_compose.video.blink_threshold'
                        defaultMessage='Threshold triggering blink'
                      />
                    </span>
                    <Slider
                      min={128}
                      max={256}
                      value={this.props.track.getIn(['video', 'blur', 'params', 'blink', 'threshold'])}
                      onChange={this.handleChangeTrackVideoBlurParamBlinkThreshold}
                    />
                  </label>
                </legend>
              </fieldset>

              {/* Particle */}
              <fieldset>
                <legend>
                  <label className='horizontal'>
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

                <legend className='track-compose-effect'>
                  <label className='horizontal'>
                    <span className='text'>
                      <FormattedMessage
                        id='pawoo_music.track_compose.video.limit_threshold'
                        defaultMessage='Threshold triggering change'
                      />
                    </span>
                    <Slider
                      min={128}
                      max={256}
                      value={this.props.track.getIn(['video', 'particle', 'params', 'limit', 'threshold'])}
                      onChange={this.handleChangeTrackVideoParticleParamLimitThreshold}
                    />
                  </label>
                  <label className='track-compose-effect-color'>
                    <div className='horizontal'>
                      <span className='text'>
                        <FormattedMessage
                          id='pawoo_music.track_compose.video.color'
                          defaultMessage='Color'
                        />
                      </span>
                      <div className='track-compose-effect-color-wrap'>
                        <div className='track-compose-effect-color-trigger' onClick={this.handleToggleParticleColorPickerVisible} role='button' tabIndex='-1'>
                          <div className='track-compose-effect-color-trigger-body' style={{ backgroundColor: constructRgbCode(this.props.track.getIn(['video', 'particle', 'params', 'color']), this.props.track.getIn(['video', 'particle', 'params', 'alpha'])) }} />
                        </div>
                        <Delay>
                          {this.state.visibleColorPicker === 'particle' && (
                            <div className='track-compose-effect-color-content'>
                              <SketchPicker
                                color={constructRgbObject(this.props.track.getIn(['video', 'particle', 'params', 'color']), this.props.track.getIn(['video', 'particle', 'params', 'alpha']))}
                                onChange={this.handleChangeTrackVideoParticleParamColor}
                              />
                            </div>
                          )}
                        </Delay>
                      </div>
                    </div>
                  </label>
                </legend>
              </fieldset>

              {/* Text */}
              <fieldset>
                <legend>
                  <label className='horizontal'>
                    <input
                      checked={this.props.track.getIn(['video', 'text', 'visible'])}
                      onChange={this.handleChangeTrackComposeTrackVideoTextVisibility}
                      type='checkbox'
                    />
                    <FormattedMessage
                      id='pawoo_music.track_compose.video.text'
                      defaultMessage='Text'
                    />
                  </label>
                </legend>
                <legend className='track-compose-effect'>
                  <div className='track-compose-effect-color'>
                    <div className='horizontal'>
                      <span className='text'>
                        <FormattedMessage
                          id='pawoo_music.track_compose.video.color'
                          defaultMessage='Color'
                        />
                      </span>
                      <div className='track-compose-effect-color-wrap'>
                        <div className='track-compose-effect-color-trigger' onClick={this.handleToggleTextColorPickerVisible} role='button' tabIndex='-1'>
                          <div className='track-compose-effect-color-trigger-body' style={{ backgroundColor: constructRgbCode(this.props.track.getIn(['video', 'text', 'params', 'color']), this.props.track.getIn(['video', 'text', 'params', 'alpha'])) }} />
                        </div>
                        <Delay>
                          {this.state.visibleColorPicker === 'text' && (
                            <div className='track-compose-effect-color-content'>
                              <SketchPicker
                                color={constructRgbObject(this.props.track.getIn(['video', 'text', 'params', 'color']), this.props.track.getIn(['video', 'text', 'params', 'alpha']))}
                                onChange={this.handleChangeTrackComposeTrackVideoTextParamColor}
                              />
                            </div>
                          )}
                        </Delay>
                      </div>
                    </div>
                  </div>
                </legend>
              </fieldset>

              {/* LightLeak */}
              <fieldset>
                <legend>
                  <label className='horizontal'>
                    <input
                      checked={this.props.track.getIn(['video', 'lightleaks', 'visible'])}
                      onChange={this.handleChangeTrackVideoLightLeaksVisibility}
                      type='checkbox'
                    />
                    <FormattedMessage
                      id='pawoo_music.track_compose.video.lightleaks'
                      defaultMessage='Light leaks'
                    />
                  </label>
                </legend>

                <legend className='track-compose-effect'>
                  <label className='horizontal'>
                    <span className='text'>
                      <FormattedMessage
                        id='pawoo_music.track_compose.video.lightleaks_alpha'
                        defaultMessage='Light leaks alpha'
                      />
                    </span>
                    <Slider
                      min={0}
                      max={1}
                      step={0.01}
                      value={this.props.track.getIn(['video', 'lightleaks', 'params', 'alpha'])}
                      onChange={this.handleChangeTrackVideoLightLeaksParamAlpha}
                    />
                  </label>
                </legend>

                <legend className='track-compose-effect'>
                  <label className='horizontal'>
                    <span className='text'>
                      <FormattedMessage
                        id='pawoo_music.track_compose.video.interval'
                        defaultMessage='Interval'
                      />
                    </span>
                    <Slider
                      min={0}
                      max={60}
                      step={0.1}
                      value={this.props.track.getIn(['video', 'lightleaks', 'params', 'interval'])}
                      onChange={this.handleChangeTrackVideoLightLeaksParamInterval}
                    />
                  </label>
                </legend>
              </fieldset>
            </form>
          </div>
        </div>

        <div className='actions'>
          <button className='cancel' onClick={this.handleCancel}>
            <FormattedMessage id='column_back_button.label' defaultMessage='Back' />
          </button>
          <button className='submit' disabled={this.props.isSubmitting} onClick={this.handleSubmit}>
            <FormattedMessage id='pawoo_music.track_compose.save' defaultMessage='Save' />
          </button>
        </div>
      </div>
    );
  }

}
