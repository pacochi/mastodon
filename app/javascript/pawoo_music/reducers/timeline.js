import { TIMELINE_UPDATE_TITLE } from '../actions/timeline';
import Immutable from 'immutable';

const initialState = Immutable.Map({
  title: 'defaultvalue',
});

export default function timeline(state = initialState, action) {
  switch(action.type) {
  case TIMELINE_UPDATE_TITLE:
    return state.set('title', action.title);
  default:
    return state;
  }
};
