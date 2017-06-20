import { TIPS_BALLOON_DISMISS } from '../actions/tips_balloon';

import Immutable from 'immutable';

const storageKey = 'tips_balloon';
let initialState;

try {
  const dismissed = JSON.parse(localStorage.getItem(storageKey));
  initialState = Immutable.Set(Array.isArray(dismissed) ? dismissed : []);
} catch (e) {
  initialState = Immutable.Set();
}

export default function tipsBallon(state = initialState, action) {
  switch(action.type) {
  case TIPS_BALLOON_DISMISS:
    const newSate = state.add(action.id);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newSate.toJS()));
    } catch (e) {}
    return newSate;
  default:
    return state;
  }
};
