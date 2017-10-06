import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import playIcon from '../../../images/pawoo_music/play.png';

// たかしへ。 toggle の display を block にすると、そこのキャンバスが使えます。 お母さんより。
class Track extends ImmutablePureComponent {

  static propTypes = {
    track: ImmutablePropTypes.map,
  }

  render() {
    const { track } = this.props;

    if (!track) {
      return null;
    }

    return (
      <div className='track'>
        <div className='musicvideo'>
          <img src={track.getIn(['video', 'image'])} alt='albumart' />
          <a><img src={playIcon} alt='playbutton' /></a>
          <toggle><canvas /></toggle>
        </div>
        <div className='credit'>
          {`${track.get('artist')} - ${track.get('title')}`}
        </div>
      </div>
    );
  }

}

export default Track;
