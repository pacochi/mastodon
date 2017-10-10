import { COLUMN_CHANGE_TARGET } from '../actions/column';
import Immutable from 'immutable';

const initialState = Immutable.Map({
  target: 'lobby',
});

export default function column(state = initialState, action) {
  switch(action.type) {
  case COLUMN_CHANGE_TARGET:
    return state.set('target', action.target);
  default:
    return state;
  }
};
