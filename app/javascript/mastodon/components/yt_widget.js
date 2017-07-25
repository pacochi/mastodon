import React from 'react';
import PropTypes from 'prop-types';

class YTWidget extends React.PureComponent {

  static propTypes = {
    videoId: PropTypes.string,
    detail: PropTypes.bool,
  };

  render () {
    const { detail } = this.props;
    return (
      <div className='status-yt-widget-wrapper'>
        <iframe
          className='status-yt-widget'
          width={detail ? '287' : '234'}
          height={detail ? '160' : '131'}
          src={`https://www.youtube.com/embed/${this.props.videoId}`}
          frameBorder='0'
        />
      </div>
    );
  }

}

export default YTWidget;
