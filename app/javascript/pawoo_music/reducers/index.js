import { combineReducers } from 'redux-immutable';
import acct_map from './acct_map';
import track_compose from './track_compose';

export default combineReducers({
  acct_map,
  track_compose,
});
