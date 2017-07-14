import {
  SUGGESTED_ACCOUNTS_FETCH_SUCCESS,
  SUGGESTED_ACCOUNTS_EXPAND_SUCCESS,
} from '../actions/suggested_accounts';
import Immutable from 'immutable';

const normalizeAccount = (state, account) => state.set(account.id, Immutable.fromJS(account));

const normalizeAccounts = (state, accounts) => {
  accounts.forEach(account => {
    state = normalizeAccount(state, account);
  });

  return state;
};

const initialState = Immutable.Map();

export default function userLists(state = initialState, action) {
  switch(action.type) {
  case SUGGESTED_ACCOUNTS_FETCH_SUCCESS:
  case SUGGESTED_ACCOUNTS_EXPAND_SUCCESS:
    return normalizeAccounts(state, action.accounts);
  default:
    return state;
  }
};
