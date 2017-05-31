import { connect } from 'react-redux';
import ComposeForm from '../components/compose_form';
import { uploadCompose } from '../../../actions/compose';
import {
  changeCompose,
  submitCompose,
  requestImageCache,
  clearComposeSuggestions,
  fetchComposeSuggestions,
  selectComposeSuggestion,
  changeComposeSpoilerText,
  insertEmojiCompose,
<<<<<<< HEAD:app/assets/javascripts/components/features/compose/containers/compose_form_container.jsx
  clearComposeHashTagSuggestions,
  fetchComposeHashTagSuggestions,
  selectComposeHashTagSuggestion
=======
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc:app/javascript/mastodon/features/compose/containers/compose_form_container.js
} from '../../../actions/compose';

const mapStateToProps = state => ({
  showSearch: state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden']),
  text: state.getIn(['compose', 'text']),
  suggestion_token: state.getIn(['compose', 'suggestion_token']),
  suggestions: state.getIn(['compose', 'suggestions']),
  hash_tag_suggestions: state.getIn(['compose', 'hash_tag_suggestions']),
  hash_tag_token: state.getIn(['compose', 'hash_tag_token']),
  spoiler: state.getIn(['compose', 'spoiler']),
  spoiler_text: state.getIn(['compose', 'spoiler_text']),
  privacy: state.getIn(['compose', 'privacy']),
  focusDate: state.getIn(['compose', 'focusDate']),
  preselectDate: state.getIn(['compose', 'preselectDate']),
  is_submitting: state.getIn(['compose', 'is_submitting']),
  is_uploading: state.getIn(['compose', 'is_uploading']),
  me: state.getIn(['compose', 'me']),
  showSearch: state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden']),
});

const mapDispatchToProps = (dispatch) => ({

  onChange (text) {
    dispatch(changeCompose(text));
    const pattern = /(https?:\/\/(?:www|touch)\.pixiv\.net\/(?:member|member_illust|novel\/show|novel\/member)\.php[^\n\s]+)/gm;
    if (pattern.test(text)) {
      text.match(pattern).forEach(url => {
        dispatch(requestImageCache(url));
      });
    }
  },

  onSubmit () {
    dispatch(submitCompose());
  },

  onClearSuggestions () {
    dispatch(clearComposeSuggestions());
  },

  onFetchSuggestions (token) {
    dispatch(fetchComposeSuggestions(token));
  },

  onSuggestionSelected (position, token, accountId) {
    dispatch(selectComposeSuggestion(position, token, accountId));
  },

  onHashTagSuggestionsClearRequested() {
    dispatch(clearComposeHashTagSuggestions());
  },

  onHashTagSuggestionsFetchRequested(token) {
    dispatch(fetchComposeHashTagSuggestions(token));
  },

  onHashTagSuggestionsSelected(tokenStart, token, value) {
    dispatch(selectComposeHashTagSuggestion(tokenStart, token, value));
  },

  onChangeSpoilerText (checked) {
    dispatch(changeComposeSpoilerText(checked));
  },

  onPaste (files) {
    dispatch(uploadCompose(files));
  },

  onPickEmoji (position, data) {
    dispatch(insertEmojiCompose(position, data));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(ComposeForm);
