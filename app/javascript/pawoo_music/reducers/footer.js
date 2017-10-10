import { FOOTER_CHANGE_TYPE } from '../actions/footer';
import Immutable from 'immutable';

const initialState = Immutable.Map({
  footerType: 'lobby_gallery',
  backTo: null,
});

export default function footer(state = initialState, action) {
  switch(action.type) {
  case FOOTER_CHANGE_TYPE:
    return state.set('footerType', action.footerType).set('backTo', action.backTo);
  default:
    return state;
  }
};
