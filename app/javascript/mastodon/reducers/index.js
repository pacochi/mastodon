import { combineReducers } from 'redux-immutable';
import timelines from './timelines';
import meta from './meta';
import compose from './compose';
import alerts from './alerts';
import { loadingBarReducer } from 'react-redux-loading-bar';
import modal from './modal';
import user_lists from './user_lists';
import accounts from './accounts';
import accounts_counters from './accounts_counters';
import statuses from './statuses';
import media_attachments from './media_attachments';
import relationships from './relationships';
import search from './search';
import notifications from './notifications';
import settings from './settings';
import status_lists from './status_lists';
import cards from './cards';
import reports from './reports';
import suggested_accounts from './suggested_accounts';
import trend_tags from './trend_tags';

export default combineReducers({
  timelines,
  meta,
  compose,
  alerts,
  loadingBar: loadingBarReducer,
  modal,
  user_lists,
  status_lists,
  accounts,
  accounts_counters,
  media_attachments,
  statuses,
  relationships,
  search,
  notifications,
  settings,
  cards,
  reports,
<<<<<<< HEAD:app/assets/javascripts/components/reducers/index.jsx
  suggested_accounts,
  trend_tags
=======
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc:app/javascript/mastodon/reducers/index.js
});
