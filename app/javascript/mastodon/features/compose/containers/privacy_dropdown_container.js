import { connect } from 'react-redux';
import PrivacyDropdown from '../components/privacy_dropdown';
import { changeComposeVisibility } from '../../../actions/compose';
import { switchCompose } from '../../../selectors';

const mapStateToProps = (state, props) => {
  state = switchCompose(state, props);

  return {
    value: state.getIn(['compose', 'privacy']),
  };
};

const mapDispatchToProps = dispatch => ({

  onChange (value) {
    dispatch(changeComposeVisibility(value));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyDropdown);
