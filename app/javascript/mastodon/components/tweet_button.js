import React from 'react';
import PropTypes from 'prop-types';
import querystring from 'querystring';

export default class TweetButton extends React.PureComponent {

  static propTypes = {
    text: PropTypes.string.isRequired,
    url: PropTypes.string,
    hashtags: PropTypes.string,
  };

  static defaultProps = {
    url: location.href,
    hashtags: '',
  }

  render() {
    const { text, url, hashtags } = this.props;
    const params = { text, url };
    if (hashtags) {
      params.hashtags = hashtags;
    }

    return (
      <a target='_blank' rel='noopener noreferrer' href={`https://twitter.com/intent/tweet?${querystring.stringify(params)}`} className='twitter-share-button'>
        <div className='twitter-share-button__wrapper'>
          <img src='/player/logos/twitter.png' width='14' height='14' className='twitter-share-button__image' />
          <span className='twitter-share-button__label'>ツイート</span>
        </div>
      </a>
    );
  }

}
