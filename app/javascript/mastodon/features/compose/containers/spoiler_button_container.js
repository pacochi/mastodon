import { connect } from 'react-redux';
import TextIconButton from '../components/text_icon_button';
import { changeComposeSpoilerness } from '../../../actions/compose';
import { injectIntl, defineMessages } from 'react-intl';
import { switchCompose } from '../../../selectors';

const messages = defineMessages({
  title: { id: 'compose_form.spoiler', defaultMessage: 'Hide text behind warning' },
});

const mapStateToProps = (state, props) => {
  state = switchCompose(state, props);
  const { intl } = props;

  return {
    label: 'CW',
    title: intl.formatMessage(messages.title),
    active: state.getIn(['compose', 'spoiler']),
    ariaControls: 'cw-spoiler-input',
  };
};

const mapDispatchToProps = dispatch => ({

  onClick () {
    dispatch(changeComposeSpoilerness());
  },

});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(TextIconButton));
