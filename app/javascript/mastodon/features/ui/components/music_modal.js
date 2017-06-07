import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import IconButton from '../../../components/icon_button';
import Button from '../../../components/button';

class MusicModal extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    music: PropTypes.object.isRequired,
    onUpload: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    isClickedWaring: false,
    imageURL: null,
  };

  handleUpload = () => {
    this.props.onUpload({
      title: this.titleElement.value,
      artist: this.artistElement.value,
      image: this.imageFileElement.files[0],
      music: this.props.music,
    });
    this.props.onClose();
  }

  handleChooseImage = (e) => {
    this.imageFileElement.click();
  }

  handleOnSelectImage = (e) => {
    Promise.resolve()
    .then(() => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(this.imageFileElement.files[0]);
    }))
    .then((url)=>{
      this.setState({
        imageURL: `url(${url})`,
      });
    });
  }

  handleChangeCheckbox = (e) => {
    this.setState({isClickedWaring: !this.state.isClickedWaring});
  }

  setMusicRef = (c) => {
    this.musicFileElement = c;
  }

  setImageRef = (c) => {
    this.imageFileElement = c;
  }

  setTitleRef = (c) => {
    this.titleElement = c;
  }

  setArtistRef = (c) => {
    this.artistElement = c;
  }

  render () {
    const { title, artist, intl } = this.props;

    return (
      <div className='modal-root__modal music-modal'>
        <div className='music-modal__container'>
          <div className="music-modal__artwork">
            {(()=>{
              if(this.state.imageURL) {
                return (
                  <div className="music-modal__artwork-exist" style={{backgroundImage: this.state.imageURL}} onClick={this.handleChooseImage} />
                );
              }
              return (
                <div className="music-modal__artwork-none icon-button" onClick={this.handleChooseImage} >
                  <i style={{ fontSize: '30px' }} className={`fa fa-fw fa-camera`} aria-hidden='true' />
                </div>
              );
            })()}
          </div>

          <div className="music-modal__metabox">
            <div>
              <input className="music-modal__title" placeholder="楽曲名を入力" ref={this.setTitleRef} defaultValue={title} />
            </div>
            <input className="music-modal__artist" placeholder="作者名を入力" ref={this.setArtistRef} defaultValue={artist} />

            <input type="file" name="music"   accept="audio/*" ref={this.setMusicRef} />
            <input type="file" name="image" accept="image/*" ref={this.setImageRef} onChange={this.handleOnSelectImage} />
          </div>
        </div>

        <div className='music-modal__action-bar'>
          <div className="action-bar__checkarea">
            <label>
              <input type="checkbox" checked={this.state.isClickedWaring} onChange={this.handleChangeCheckbox} />
              あなた自身が作成したコンテンツです
            </label>
          </div>
          <Button disabled={!this.state.isClickedWaring} text="upload" onClick={this.handleUpload} />
        </div>
      </div>
    );
  }

}

export default injectIntl(MusicModal);
