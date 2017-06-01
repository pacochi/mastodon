import { connect } from 'react-redux';
import MusicButton from '../components/music_button';

import jsmediatags from 'jsmediatags';

import { openModal } from '../../../actions/modal';
//import { uploadMusicCompose } from '../../../actions/compose';

const mapStateToProps = state => ({
  disabled: state.getIn(['compose', 'is_uploading']) || (state.getIn(['compose', 'media_attachments']).size > 3 || state.getIn(['compose', 'media_attachments']).some(m => m.get('type') === 'video')),
  resetFileKey: state.getIn(['compose', 'resetFileKey'])
});

const mapDispatchToProps = dispatch => ({

  onUpload () {
//    alert(1);
  },

  onSelectFile (files) {
    const self = this;
    jsmediatags.read(files[0], {
      onSuccess(tag) {
        dispatch(openModal('MUSIC',{
          title: tag.tags.title,
          artist: tag.tags.artist,
          music: files[0],
          onUpload: self.onUpload
        }));
      },
      onError(error) {
        console.log(':(', error.type, error.info);
      }
    });
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(MusicButton);
