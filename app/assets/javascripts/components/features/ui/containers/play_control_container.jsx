import { connect } from 'react-redux';
import PlayControl from '../components/play_control';
import { failMiscError } from '../../../actions/miscerrors';

const mapStateToProps = state => ({
  accessToken: state.getIn(['meta', 'access_token']),
  streamingAPIBaseURL: state.getIn(['meta', 'streaming_api_base_url'])
});

const mapDispatchToProps = dispatch => ({
  onError(e){
    dispatch(failMiscError());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayControl);
