import { connect } from 'react-redux';
import SearchResults from '../components/search_results';

const mapStateToProps = state => ({
  results: state.getIn(['search', 'results']),
<<<<<<< HEAD:app/assets/javascripts/components/features/compose/containers/search_results_container.jsx
  isAdmin: state.getIn(['meta', 'is_user_admin']),
  searchKeyword: state.getIn(['search', 'value'])
=======
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc:app/javascript/mastodon/features/compose/containers/search_results_container.js
});

export default connect(mapStateToProps)(SearchResults);
