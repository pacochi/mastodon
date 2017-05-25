import { connect } from 'react-redux';
import SearchResults from '../components/search_results';

const mapStateToProps = state => ({
  results: state.getIn(['search', 'results']),
  isAdmin: state.getIn(['meta', 'me']) === state.getIn(['meta', 'admin']),
  searchKeyword: state.getIn(['search', 'value'])
});

export default connect(mapStateToProps)(SearchResults);
