import { BOOTH_ITEM_FETCH_SUCCESS } from '../actions/booth_items';

import Immutable from 'immutable';

const initialState = Immutable.Map();

export default function cards(state = initialState, action) {
  switch(action.type) {
  case BOOTH_ITEM_FETCH_SUCCESS:
    return state.set(action.id, Immutable.fromJS(action.booth_item));
  default:
    return state;
  }
};
