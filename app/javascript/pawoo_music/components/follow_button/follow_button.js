import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import Button from '../button';

export default class FollowButton extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    me: PropTypes.number,
    onFollow: PropTypes.func.isRequired,
  };

  handleFollowClick = () => {
    const { onFollow, account } = this.props;

    onFollow(account);
  }

  render () {
    const { account, me } = this.props;

    if (!me) {
      return (
        <Button href={`/users/${account.get('acct')}/remote_follow`}>
          <FormattedMessage id='account.remote_follow' defaultMessage='Remote follow' />
        </Button>
      );
    }

    if (me !== account.get('id')) {
      if (account.getIn(['relationship', 'requested'])) {
        return (
          <Button disabled>
            <FormattedMessage id='account.requested' defaultMessage='Awaiting approval' />
          </Button>
        );
      } else if (!account.getIn(['relationship', 'blocking'])) {
        return (
          <Button onClick={this.handleFollowClick}>
            {account.getIn(['relationship', 'following']) ? (
              <FormattedMessage id='account.unfollow' defaultMessage='Unfollow' />
            ) : (
              <FormattedMessage id='account.follow' defaultMessage='Follow' />
            )}
          </Button>
        );
      }
    }

    return null;
  }

};
