import {
  TREND_TAGS_REQUEST,
  TREND_TAGS_SUCCESS,
  refreshTrendTags
} from "../actions/trend_tags.jsx"
import Immutable from 'immutable';

const initialState = Immutable.Map({
    tags: Immutable.List()
});

export default function trendtags(state = initialState, action) {
  switch(action.type) {
  case TREND_TAGS_REQUEST:
    return refreshTrendTags();
  case TREND_TAGS_SUCCESS:
    return state.set('tags', Immutable.fromJS(action.tags));
  default:
    return state;
  }
}
