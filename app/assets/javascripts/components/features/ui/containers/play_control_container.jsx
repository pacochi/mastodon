import { connect } from 'react-redux';
import PlayControl from '../components/play_control';

const mapStateToProps = state => ({
  accessToken: state.getIn(['meta', 'access_token'])
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(PlayControl);
