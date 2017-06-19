import { connect } from 'react-redux';
import TipsBalloon from '../components/tips_balloon';
import { dismissTipsBalloon } from '../actions/tips_balloon';

const makeMapStateToProps = () => {
  return (state, props) => ({
    dismiss: state.hasIn(['tips_balloon', props.id]),
  });
};

const mapDispatchToProps = (dispatch) => ({
  onDismiss (id) {
    dispatch(dismissTipsBalloon(id));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(TipsBalloon);
