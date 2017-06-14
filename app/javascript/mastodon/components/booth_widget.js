import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class BoothWidget extends React.PureComponent {

  constructor (props, context) {
    super(props, context);
    this.state = {
      apollo: /https?:\/\/booth\.pm\/apollo/.test(props.url),
      item: null,
      isPlaying: false,
      currentTime: 0,
    };

    this.audio = new Audio();
  }

  componentDidMount () {
    this.audio.addEventListener('timeupdate', this.onTimeupdate, true);

    // FIXME: Reduxにするときによしなにしよう
    axios.get(`/api/v1/booth_items/${this.props.itemId}`)
      .then(response => {
        // FIXME: Reduxにするときによしなにしよう
        this.setState({item: response.data.body});
      }).catch(() => {
        // privateなBOOTHリンクなどは404が返ってくるので何もしない
      });
  }

  componentWillUnmount() {
    this.audio.removeEventListener('timeupdate', this.onTimeupdate, true);

    if (this.state.isPlaying) {
      this.pause();
    }
  }

  onTimeupdate = () => {
    const currentTime = this.audio.currentTime;
    this.setState({ currentTime });
  }

  handleSeekbarClick = (e) => {
    e.preventDefault();
    const seekPoint = e.nativeEvent.layerX;
    const targetWidth = document.querySelector('.booth-widget__seekbar').clientWidth;
    const currentTime = (seekPoint / targetWidth * this.state.item.sound.duration);
    this.audio.currentTime = currentTime;
    this.setState({ currentTime });
  }

  play () {
    const sound = this.state.item.sound;
    this.audio.src = sound.long_url;
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
    this.setState({isPlaying: !this.state.isPlaying});
  }

  renderMusic () {
    const seekBarProgressStyle = {
      width: Math.round(this.state.currentTime / this.state.item.sound.duration * 10000) / 100 + '%',
    };
    return (
      <div className={`booth-widget booth-widget--music ${this.state.isPlaying ? 'is-playing' : ''} ${this.state.apollo ? 'is-apollo' : ''}`}>
        <div className="booth-widget__viewer">
          <div className="booth-widget__viewer-btn" onClick={this.handlePlayerClick}>
            <i className={`fa ${this.state.isPlaying ? 'fa-pause' : 'fa-play'}`} />
          </div>
          <img className="booth-widget__image" src={this.state.item.primary_image.f_620.url} alt=""/>
        </div>
        <div className="booth-widget__seekbar" onClick={this.handleSeekbarClick}>
          <div className="booth-widget__seekbar-process" style={seekBarProgressStyle} />
        </div>
        <div className="booth-widget__text">
          <div className="booth-widget__seekbar-time">
            {parseInt((this.state.item.sound.duration - Math.round(this.state.currentTime))/60)}:{("0"+(this.state.item.sound.duration - Math.round(this.state.currentTime))%60).slice(-2)}
          </div>
          <a className="booth-widget__shop" href={this.state.item.shop.url} target="_blank">
            <div className="booth-widget__shop-name">{this.state.item.shop.name}</div>
          </a>
          <a className="booth-widget__name" href={this.props.url} target="_blank">
            {this.state.item.name}
          </a>
        </div>
        <div className="booth-widget__footer">
          <div className="booth-widget__price">
            {this.state.item.price_str}
          </div>
          <a className="booth-widget__logo" href={this.props.url} target="_blank" />
        </div>
      </div>
    );
  }

  renderNormal () {
    return (
      <div className="booth-widget">
        <div className="booth-widget__viewer">
          <a href={this.props.url} target="_blank">
            <img className="booth-widget__image" src={this.state.item.primary_image.f_620.url} alt=""/>
          </a>
        </div>
        <div className="booth-widget__text">
          <a className="booth-widget__shop" href={this.state.item.shop.url} target="_blank">
            <div className="booth-widget__shop-name">{this.state.item.shop.name}</div>
          </a>
          <a className="booth-widget__name" href={this.props.url} target="_blank">
            {this.state.item.name}
          </a>
        </div>
        <div className="booth-widget__footer">
          <div className="booth-widget__price">
            {this.state.item.price_str}
          </div>
          <a className="booth-widget__logo" href={this.props.url} target="_blank" />
        </div>
      </div>
    );
  }

  render () {
    if (!this.state.item) {
      return null;
    }
    if (this.state.item.sound) {
      return this.renderMusic();
    }
    return this.renderNormal();
  }

}

BoothWidget.propTypes = {
  itemId: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
};

export default BoothWidget;
