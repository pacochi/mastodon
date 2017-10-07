import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import React from 'react';
import { ChromePicker } from 'react-color';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import {
  focusTrackComposeBasicTab,
  focusTrackComposeVideoTab,
  changeTrackComposeTrackTitle,
  changeTrackComposeTrackArtist,
  changeTrackComposeTrackText,
  changeTrackComposeTrackMusic,
  changeTrackComposeTrackVideoImage,
  changeTrackComposeTrackVideoBlurVisibility,
  changeTrackComposeTrackVideoBlurParamMovementThreshold,
  changeTrackComposeTrackVideoBlurParamBlinkThreshold,
  changeTrackComposeTrackVideoParticleVisibility,
  changeTrackComposeTrackVideoParticleParamColor,
  changeTrackComposeTrackVideoParticleParamLimitThreshold,
  changeTrackComposeTrackVideoSpectrumVisiblity,
  changeTrackComposeTrackVideoSpectrumParamMode,
  changeTrackComposeTrackVideoSpectrumParamColor,
  submitTrackCompose,
} from '../../actions/track_compose';
import Musicvideo from '../../components/musicvideo';
import { convertToRgbObject } from '../../util/musicvideo';

const messages = defineMessages({
  preview: { id: 'track_compose.preview', defaultMessage: 'Video preview' },
});

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

  onChangeTrackVideoParticleParamColor (value) {
    dispatch(changeTrackComposeTrackVideoParticleParamColor(value));
  },

  onChangeTrackVideoParticleParamLimitThreshold (value) {
    dispatch(changeTrackComposeTrackVideoParticleParamLimitThreshold(value));
  },

  onChangeTrackVideoSpectrumVisibility (value) {
    dispatch(changeTrackComposeTrackVideoSpectrumVisiblity(value));
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
    onChangeTrackText: PropTypes.func.isRequired,
    onChangeTrackMusic: PropTypes.func.isRequired,
    onChangeTrackVideoImage: PropTypes.func.isRequired,
    onChangeTrackVideoBlurVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoBlurParamMovementThreshold: PropTypes.func.isRequired,
    onChangeTrackVideoBlurParamBlinkThreshold: PropTypes.func.isRequired,
    onChangeTrackVideoParticleVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoParticleParamColor: PropTypes.func.isRequired,
    onChangeTrackVideoParticleParamLimitThreshold: PropTypes.func.isRequired,
    onChangeTrackVideoSpectrumVisibility: PropTypes.func.isRequired,
    onChangeTrackVideoSpectrumParamMode: PropTypes.func.isRequired,
    onChangeTrackVideoSpectrumParamColor: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    tab: PropTypes.string.isRequired,
    track: ImmutablePropTypes.map.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
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

  handleChangeTrackText = ({ target }) => {
    this.props.onChangeTrackText(target.value);
  }

  handleChangeTrackVideoImage = ({ target }) => {
    this.props.onChangeTrackVideoImage(target.files[0]);
  }

  handleChangeTrackVideoBlurVisibility = ({ target }) => {
    this.props.onChangeTrackVideoBlurVisibility(target.checked);
  }

  handleChangeTrackBlurParamMovementThreshold = ({ target }) => {
    this.props.onChangeTrackVideoBlurParamMovementThreshold(target.value);
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
    const { track } = this.props;

    return (
      <div className='track-compose'>
        <div className='content'>
          <Musicvideo track={track} label={this.props.intl.formatMessage(messages.preview)} autoPlay={false} />
          <div className='form-content'>
            <div className='tablist' role='tablist'>
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
            <form>
              <fieldset
                id='pawoo-music-basic-tabpanel'
                aria-expanded={(this.props.tab === 'basic').toString()}
                aria-labelledby='pawoo-music-basic-tab'
                style={{ display: this.props.tab === 'basic' || 'none' }}
              >
                <legend>
                  <label className='horizontal'>
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
                </legend>

                <legend>
                  <label className='horizontal'>
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
                      type='text'
                      value={this.props.track.get('title')}
                    />
                  </label>
                </legend>

                <legend>
                  <label className='horizontal'>
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
                      type='text'
                      value={this.props.track.get('artist')}
                    />
                  </label>
                </legend>

                <legend>
                  <label className='horizontal'>
                    <span className='text'>
                      <FormattedMessage
                        id='pawoo_music.track_compose.basic.details'
                        defaultMessage='Details'
                      />
                    </span>
                    <textarea
                      maxLength='500'
                      onChange={this.handleChangeTrackText}
                      value={this.props.track.get('text')}
                    />
                  </label>
                </legend>
              </fieldset>

              <fieldset
                id='pawoo-music-video-tabpanel'
                aria-expanded={(this.props.tab === 'video').toString()}
                aria-labelledby='pawoo-music-video-tab'
                style={{ display: this.props.tab === 'video' || 'none' }}
              >
                <legend>
                  <label className='horizontal'>
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
                </legend>

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
                  <label className='horizontal'>
                    <span className='text'>
                      <FormattedMessage
                        id='pawoo_music.track_compose.video.movement_threshold'
                        defaultMessage='Threshold triggering movement'
                      />
                    </span>
                    <input
                      min='128'
                      max='256'
                      onChange={this.handleChangeTrackBlurParamMovementThreshold}
                      type='range'
                      value={this.props.track.getIn(['video', 'blur', 'params', 'movement', 'threshold'])}
                    />
                  </label>
                  <label className='horizontal'>
                    <span className='text'>
                      <FormattedMessage
                        id='pawoo_music.track_compose.video.blink_threshold'
                        defaultMessage='Threshold triggering blink'
                      />
                    </span>
                    <input
                      min='128'
                      max='256'
                      onChange={this.handleChangeTrackVideoBlurParamBlinkThreshold}
                      type='range'
                      value={this.props.track.getIn(['video', 'blur', 'params', 'blink', 'threshold'])}
                    />
                  </label>
                </fieldset>

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
                  <label className='horizontal'>
                    <span className='text'>
                      <FormattedMessage
                        id='pawoo_music.track_compose.video.limit_threshold'
                        defaultMessage='Threshold triggering change'
                      />
                    </span>
                    <input
                      min='128'
                      max='256'
                      onChange={this.handleChangeTrackVideoParticleParamLimitThreshold}
                      type='range'
                      value={this.props.track.getIn(['video', 'particle', 'params', 'limit', 'threshold'])}
                    />
                  </label>
                  <ChromePicker
                    color={convertToRgbObject(this.props.track.getIn(['video', 'particle', 'params', 'color']))}
                    disableAlpha
                    onChange={this.handleChangeTrackVideoParticleParamColor}
                  />
                </fieldset>

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
                  color={convertToRgbObject(this.props.track.getIn(['video', 'spectrum', 'params', 'color']))}
                  disableAlpha
                  onChange={this.handleChangeTrackVideoSpectrumParamColor}
                />
              </fieldset>
            </form>
          </div>
        </div>

        <div className='actions'>
          <button
            disabled={this.props.isSubmitting}
            onClick={this.handleSubmit}
          >
            <FormattedMessage
              id='pawoo_music.track_compose.save'
              defaultMessage='Save'
            />
          </button>
          <a href='/'>
            <button>
              <FormattedMessage
                id='column_back_button.label'
                defaultMessage='Back'
              />
            </button>
          </a>
        </div>
      </div>
    );
  }

}
