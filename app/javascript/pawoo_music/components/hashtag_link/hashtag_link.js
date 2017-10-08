import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';

export default class HashtagLink extends PureComponent {

  static propTypes = {
    hashtag: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }

  render () {
    const { hashtag, onClick } = this.props;

    return (
      <Link className='hashtag-link' to={`/tags/${hashtag}`} onClick={onClick}>
        #{hashtag}
      </Link>
    );
  }

};
