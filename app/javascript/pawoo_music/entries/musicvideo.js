import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import Track from '../components/track';

export default class MusicvideoEntry extends React.PureComponent {

  static propTypes = {
    track: PropTypes.object.isRequired,
  }

  render () {
    const { track } = this.props;
    return (
      <Track track={Immutable.fromJS(track)} />
    );
  }

}
