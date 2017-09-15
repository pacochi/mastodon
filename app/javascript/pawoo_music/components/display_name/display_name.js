import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import escapeTextContentForBrowser from 'escape-html';
import classNames from 'classnames';
import emojify from '../../../mastodon/emoji';

export default class DisplayName extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    className: PropTypes.string,
  };

  render () {
    const { account, className } = this.props;
    const displayName     = account.get('display_name').length === 0 ? account.get('username') : account.get('display_name');
    const displayNameHTML = { __html: emojify(escapeTextContentForBrowser(displayName)) };

    return (
      <strong className={classNames('display-name', className)} dangerouslySetInnerHTML={displayNameHTML} />
    );
  }

}
