import { connect }   from 'react-redux';
import Announcements from '../components/announcements';
import { addColumn } from '../../../actions/columns';

const mapStateToProps = (state) => {
  return {
    account: state.getIn(['accounts', state.getIn(['meta', 'me'])]),
    pinnedComiketTag: state.getIn(['settings', 'columns']).find((colmun) => {
      return colmun.get('id') === 'SUGGESTION_TAGS' && colmun.getIn(['params', 'type']) === 'comiket';
    }),
  };
};

const mapDispatchToProps = (dispatch) => ({
  addComiketTagColumn () {
    dispatch(addColumn('SUGGESTION_TAGS', { type: 'comiket' }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Announcements);
