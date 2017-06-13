import { connect } from 'react-redux';
import MusicButton from '../components/music_button';

import { uploadMusicCompose } from '../../../actions/compose';
import { openModal } from '../../../actions/modal';

const mapStateToProps = state => ({
  disabled: state.getIn(['compose', 'is_uploading']) || (state.getIn(['compose', 'media_attachments']).size > 3 || state.getIn(['compose', 'media_attachments']).some(m => m.get('type') === 'video')),
  resetFileKey: state.getIn(['compose', 'resetFileKey']),
});

const mapDispatchToProps = dispatch => ({

  onUpload (payload) {
    dispatch(uploadMusicCompose(payload));
  },

  onSelectFile (file, tag) {
    const tagSupport = tag.version[0] === '2';
    const title = (tagSupport && typeof tag.tags.title !== "undefined") ? tag.tags.title.substr(0, 128) : '';
    const artist = (tagSupport && typeof tag.tags.artist !== "undefined") ? tag.tags.artist.substr(0, 128) : '';

    dispatch(openModal('MUSIC', {
      title,
      artist,
      music: file,
      onUpload: this.onUpload,
    }));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(MusicButton);
