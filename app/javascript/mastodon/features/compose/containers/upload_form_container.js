import { connect } from 'react-redux';
import UploadForm from '../components/upload_form';
import { undoUploadCompose } from '../../../actions/compose';
import { switchCompose } from '../../../selectors';

const mapStateToProps = (state, props) => {
  state = switchCompose(state, props);

  return {
    media: state.getIn(['compose', 'media_attachments']),
  };
};

const mapDispatchToProps = dispatch => ({

  onRemoveFile (media_id) {
    dispatch(undoUploadCompose(media_id));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(UploadForm);
