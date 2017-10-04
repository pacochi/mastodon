import { connect } from 'react-redux';
import UploadProgress from '../components/upload_progress';
import { switchCompose } from '../../../selectors';

const mapStateToProps = (state, props) => {
  state = switchCompose(state, props);

  return {
    active: state.getIn(['compose', 'is_uploading']),
    progress: state.getIn(['compose', 'progress']),
  };
};

export default connect(mapStateToProps)(UploadProgress);
