import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import IconButton from '../../../components/icon_button';
import Button from '../../../components/button';

const messages = defineMessages({
  publish: { id: 'status.publush', defaultMessage: 'Upload' }
});

class MusicModal extends React.PureComponent {

  constructor (props, context) {
    super(props, context);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleAccountClick = this.handleAccountClick.bind(this);
  }

  handleUpload() {
    this.props.onReblog(this.props.status);
    this.props.onClose();
  }

  handleAccountClick (e) {
    if (e.button === 0) {
      e.preventDefault();
      this.props.onClose();
      this.context.router.push(`/accounts/${this.props.status.getIn(['account', 'id'])}`);
    }
  }

  render () {
    const { status, intl, onClose } = this.props;

    return (
      <div className='modal-root__modal music-modal'>
        <div className='music-modal__container'>
          <div className="music-modal__artwork">
            <div className="music-modal__artwork-none">
              <IconButton icon='camera' title="test" />
            </div>
          </div>

          <div className="music-modal__metabox">
            <div>
              <input className="music-modal__title" placeholder="楽曲名を入力" />
            </div>
            <input className="music-modal__artist" placeholder="作者名を入力" />
          </div>
        </div>

        <div className='music-modal__action-bar'>
          <div className="action-bar__checkarea">
            <label>
              <input type="checkbox" />
              あなた自身が作成したコンテンツです
            </label>
          </div>
          <Button text="upload" onClick={this.handleUpload} />
        </div>
      </div>
    );
  }

}

MusicModal.contextTypes = {
  router: PropTypes.object
};

MusicModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
};

export default injectIntl(MusicModal);
