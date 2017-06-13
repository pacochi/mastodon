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
    isTermsOfUseOpen: false,
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

  handleShowTermsOfUse = (e) => {
    e.preventDefault();
    this.setState({isTermsOfUseOpen: !this.state.isTermsOfUseOpen});
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
                  <span className="music-modal__artwork-info">画像を<br />アップロード<br />（必須）</span>
                </div>
              );
            })()}
          </div>

          <div className="music-modal__metabox">
            <div>
              <input className="music-modal__title" placeholder="楽曲名を入力" ref={this.setTitleRef} defaultValue={title} />
            </div>
            <input className="music-modal__artist" placeholder="作者名を入力" ref={this.setArtistRef} defaultValue={artist} />
            <span className="music-modal__info">※128文字を超える部分は自動的にカットされます</span>

            <input type="file" name="music"   accept="audio/*" ref={this.setMusicRef} />
            <input type="file" name="image" accept="image/*" ref={this.setImageRef} onChange={this.handleOnSelectImage} />
          </div>
        </div>

        <div className='music-modal__action-bar'>
          <div className='music-modal__upload'>
            <input className='music-modal__checkbox-confirm' id="checkbox-confirm" type="checkbox" checked={this.state.isClickedWaring} onChange={this.handleChangeCheckbox} />
            <div className='music-modal__checkbox-content'>
              <label htmlFor="checkbox-confirm">
                作品（画像、音源、楽曲、テキスト等を含む）のアップロードにおいて、<span className='music-modal__link-terms-of-use' onClick={this.handleShowTermsOfUse}>注意事項</span>を守ることを誓います。
              </label>
            </div>
            <div className='music-modal__submit-button'>
              <Button disabled={!this.state.isClickedWaring || !this.state.imageURL} text="upload" onClick={this.handleUpload} />
            </div>
          </div>
          {(()=>{
            if (this.state.isTermsOfUseOpen) {
              return(
                <div className='music-modal__terms-of-use'>
                  １．この作品をインターネットで配信することが、第三者のいかなる権利も侵害しないこと。<br />
                  <br />
                  ２．マストドンというソフトウェアの仕様上、この作品が自動で他の様々なマストドンインスタンスにも複製され、配信されることに同意すること。<br />
                  （前提として、マストドンのソフトウェアの規約上、複製された作品を第三者が商用利用する行為は禁止されています。権利を侵害する行為は関連法令により罰せられることがあります。）<br />
                  <br />
                  ３．この楽曲のインターネットでの配信（インタラクティブ配信）に係る権利について、著作権等管理団体に管理委託または信託していないこと。<br />
                  <br />
                  ４．楽曲のアップロード後に、当該楽曲のインターネットでの配信（インタラクティブ配信）に係る権利の管理を第三者に委託した場合は、管理委託・信託契約の効力発生日前に、当サービスからアップロードした作品を削除すること。<br />
                  <br />
                  ５．他人の作品を許可なくアップロードしたことにより、当サービスまたは第三者に損害を与えたときは、当該アップロード者が一切の責任を負うものとし、当社はその一切の責任を負いません。
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>
    );
  }

}

export default injectIntl(MusicModal);
