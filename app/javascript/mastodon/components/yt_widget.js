import React from 'react';
import PropTypes from 'prop-types';

class YTWidget extends React.PureComponent {

  static propTypes = {
    videoId: PropTypes.string,
  };

  render () {
    return (
      <div className='status-wtwidget-wrapper'>
        <iframe
          className='status-wtwidget'
          width='234'
          height='131'
          src={`https://www.youtube.com/embed/${this.props.videoId}`}
          frameBorder='0'
        />
      </div>
    );
  }

}

export default YTWidget;
