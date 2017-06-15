import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

class BoothWidget extends React.PureComponent {

  static propTypes = {
    itemId: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    boothItem: ImmutablePropTypes.map.isRequired,
  };

  constructor (props, context) {
    super(props, context);

    this.state = {
      apollo: /https?:\/\/booth\.pm\/apollo/.test(props.url),
      isPlaying: false,
      currentTime: 0,
    };

    this.audio = new Audio();
  }

  componentDidMount () {
    this.audio.addEventListener('timeupdate', this.onTimeUpdate, true);
  }

  componentWillUnmount() {
    this.audio.removeEventListener('timeupdate', this.onTimeUpdate, true);
  }

  onTimeUpdate = () => {
    const currentTime = this.audio.currentTime;
    this.setState({ currentTime });
  }

  handleSeekbarClick = (e) => {
    e.preventDefault();

    const { boothItem } = this.props;

    const seekPoint = e.nativeEvent.layerX;
    const targetWidth = document.querySelector('.booth-widget__seekbar').clientWidth;
    const currentTime = (seekPoint / targetWidth * boothItem.getIn(['sound', 'duration']));

    this.audio.currentTime = currentTime;
    this.setState({ currentTime });
  }

  play () {
    this.audio.src = this.props.boothItem.getIn(['sound', 'long_url']);
    this.audio.currentTime = this.state.currentTime;
    this.audio.play();
  }

  pause () {
    this.audio.pause();
  }

  handlePlayerClick = () => {
    if (!this.state.isPlaying) {
      this.play();
    } else {
      this.pause();
    }

    this.setState({ isPlaying: !this.state.isPlaying });
  }

  renderMusic () {
    const { boothItem } = this.props;

    const seekBarProgressStyle = {
      width: `${Math.round(this.state.currentTime / boothItem.getIn(['sound', 'duration']) * 10000) / 100}%`,
    };

    return (
      <div className={`booth-widget booth-widget--music ${this.state.isPlaying ? 'is-playing' : ''} ${this.state.apollo ? 'is-apollo' : ''}`}>
        <div className="booth-widget__viewer">
          <div className="booth-widget__viewer-btn" onClick={this.handlePlayerClick}>
            <i className={`fa ${this.state.isPlaying ? 'fa-pause' : 'fa-play'}`} />
          </div>
          <img className="booth-widget__image" src={boothItem.getIn(['primary_image', 'f_620', 'url'])} alt=""/>
        </div>
        <div className="booth-widget__seekbar-wrapper">
          <div className="booth-widget__text">
            <div className="booth-widget__seekbar-time">
              {parseInt((boothItem.getIn(['sound', 'duration']) - Math.round(this.state.currentTime))/60)}:{("0"+(boothItem.getIn(['sound', 'duration']) - Math.round(this.state.currentTime))%60).slice(-2)}
            </div>
            <a className="booth-widget__shop" href={boothItem.getIn(['shop', 'url'])} target="_blank">
              <div className="booth-widget__shop-name">{boothItem.getIn(['shop', 'name'])}</div>
            </a>
            <a className="booth-widget__name" href={this.props.url} target="_blank">
              {boothItem.get('name')}
            </a>
          </div>
          <div className="booth-widget__seekbar" onClick={this.handleSeekbarClick}>
            <div className="booth-widget__seekbar-process" style={seekBarProgressStyle} />
          </div>
        </div>
        <div className="booth-widget__footer">
          <div className="booth-widget__price">
            {boothItem.get('price_str')}
          </div>
          <a className="booth-widget__logo" href={this.props.url} target="_blank" />
        </div>
      </div>
    );
  }

  renderNormal () {
    const { boothItem } = this.props;

    return (
      <div className="booth-widget">
        <div className="booth-widget__viewer">
          <a href={this.props.url} target="_blank">
            <img className="booth-widget__image" src={boothItem.getIn(['primary_image', 'f_620', 'url'])} alt=""/>
          </a>
        </div>
        <div className="booth-widget__text">
          <a className="booth-widget__shop" href={boothItem.getIn(['shop', 'url'])} target="_blank">
            <div className="booth-widget__shop-name">{boothItem.getIn(['shop', 'name'])}</div>
          </a>
          <a className="booth-widget__name" href={this.props.url} target="_blank">
            {boothItem.get('name')}
          </a>
        </div>
        <div className="booth-widget__footer">
          <div className="booth-widget__price">
            {boothItem.get('price_str')}
          </div>
          <a className="booth-widget__logo" href={this.props.url} target="_blank" />
        </div>
      </div>
    );
  }

  render () {
    const { boothItem } = this.props;

    if (boothItem.get('sound')) {
      return this.renderMusic();
    } else {
      return this.renderNormal();
    }
  }

}

export default BoothWidget;
