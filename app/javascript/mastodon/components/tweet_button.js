import React from 'react';
import PropTypes from 'prop-types';

export default class TweetButton extends React.PureComponent {

  static propTypes = {
    text: PropTypes.string.isRequired,
    url: PropTypes.string,
  };

  static defaultProps = {
    url: location.href,
  }

  render() {
    const text = encodeURIComponent(this.props.text);
    const url = encodeURIComponent(this.props.url);

    return (
      <a target='_blank' rel='noopener noreferrer' href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`} className='twitter-share-button'>
        <div className='twitter-share-button__wrapper'>
          <img src='/player/logos/twitter.png' width='14' height='14' className='twitter-share-button__image' />
          <span className='twitter-share-button__label'>ツイート</span>
        </div>
      </a>
    );
  }

}
