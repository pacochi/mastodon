import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import IconButton from '../../../components/icon_button';
import Button from '../../../components/button';

const storageKey = 'music_modal_clicked_warning';
const warningClass = 'warning';

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
    onResetFileKey: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    let isClickedWaring = false;

    try {
      // すでにチェックしたことがあれば、その値を利用する
      isClickedWaring = localStorage.getItem(storageKey) == '1';
    } catch (e) {
      // Do nothing for private safari
    }

    this.state = {
      title: this.props.title,
      artist: this.props.artist,
      isClickedWaring: isClickedWaring,
      imageURL: null,
      isTermsOfUseOpen: false,
      onMouseInUploadButton: false,
    };
  }

  componentDidMount() {
    this.uploadButtonElement.addEventListener('mouseenter', this.onMouseEnterUploadButton, true);
    this.uploadButtonElement.addEventListener('mouseleave', this.onMouseLeaveUploadButton, true);
  }

  componentWillUnmount() {
    this.props.onResetFileKey();
    this.uploadButtonElement.removeEventListener('mouseenter', this.onMouseEnterUploadButton, true);
    this.uploadButtonElement.removeEventListener('mouseleave', this.onMouseLeaveUploadButton, true);
  }

  handleUpload = () => {
    this.props.onUpload({
      title: this.state.title,
      artist: this.state.artist,
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

  handleChangeCheckbox = () => {
    const newValue = !this.state.isClickedWaring;

    try {
      localStorage.setItem(storageKey, newValue ? '1' : '0');
    } catch (e) {
      // Do nothing for private safari
    }

    this.setState({ isClickedWaring: newValue });
  }

  handleShowTermsOfUse = (e) => {
    e.preventDefault();
    this.setState({ isTermsOfUseOpen: !this.state.isTermsOfUseOpen });
  }

  onChangeTitle = (event) => {
    const title = event.currentTarget.value;
    this.setState({ title: title });
  }

  onChangeArtist = (event) => {
    const artist = event.currentTarget.value;
    this.setState({ artist: artist });
  }

  setMusicRef = (element) => {
    this.musicFileElement = element;
  }

  setImageRef = (element) => {
    this.imageFileElement = element;
  }

  setUploadButtonRef = (element) => {
    this.uploadButtonElement = element;
  }

  onMouseEnterUploadButton = () => {
    this.setState({ onMouseInUploadButton: true });
  }

  onMouseLeaveUploadButton = () => {
    this.setState({ onMouseInUploadButton: false });
  }

  isValidString(value) {
    // validates ..., presence: true の条件に合わせる
    return value.replace(/\s/, '').length > 0;
  }

  render () {
    const { intl } = this.props;
    const { title, artist } = this.state;

    const validTitle = this.isValidString(this.state.title);
    const validArtist = this.isValidString(this.state.artist);
    const enableUploadButton = this.state.isClickedWaring && this.state.imageURL && validTitle && validArtist;

    return (
      <div className='modal-root__modal music-modal'>
        <div className='music-modal__container'>
          <div className="music-modal__artwork">
            {(() => {
              if(this.state.imageURL) {
                return (
                  <div className="music-modal__artwork-exist" style={{backgroundImage: this.state.imageURL}} onClick={this.handleChooseImage} />
                );
              } else {
                const klass = this.state.onMouseInUploadButton ? warningClass : '';

                return (
                  <div className={`music-modal__artwork-none icon-button ${klass}`} onClick={this.handleChooseImage} >
                    <i style={{ fontSize: '30px' }} className='fa fa-fw fa-camera' aria-hidden='true' />
                    <span className="music-modal__artwork-info">画像を<br />アップロード<br />（必須）</span>
                  </div>
                );
              }
            })()}
          </div>

          <div className="music-modal__metabox">
            <div>
              <input className={`music-modal__title ${(this.state.onMouseInUploadButton && !validTitle) ? warningClass : ''}`} placeholder="楽曲名を入力" onChange={this.onChangeTitle} value={this.state.title} />
            </div>
            <div>
              <input className={`music-modal__artist ${(this.state.onMouseInUploadButton && !validArtist) ? warningClass : ''}`} placeholder="作者名を入力" onChange={this.onChangeArtist} value={artist} />
            </div>
            <span className="music-modal__info">※128文字を超える部分は自動的にカットされます</span>

            <input type="file" name="music" accept="audio/*" ref={this.setMusicRef} />
            <input type="file" name="image" accept="image/*" ref={this.setImageRef} onChange={this.handleOnSelectImage} />
          </div>
        </div>

        <div className='music-modal__action-bar'>
          <div className='music-modal__upload'>
            <input className='music-modal__checkbox-confirm' id="checkbox-confirm" type="checkbox" checked={this.state.isClickedWaring} onChange={this.handleChangeCheckbox} />
            <div className='music-modal__checkbox-content'>
              <label htmlFor="checkbox-confirm">
                作品（画像、音源、楽曲、テキスト等を含む）のアップロードにおいて、<span className='music-modal__link-terms-of-use' onClick={this.handleShowTermsOfUse}>注意事項▼</span>を守ることを誓います。
              </label>
            </div>
            <div ref={this.setUploadButtonRef} className='music-modal__submit-button'>
              <Button disabled={!enableUploadButton} text="upload" onClick={this.handleUpload} />
            </div>
          </div>
          {this.state.isTermsOfUseOpen && (
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
          )}
        </div>
      </div>
    );
  }

}

export default injectIntl(MusicModal);
