import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Button from '../../components/button';
import { followAccount, unfollowAccount } from '../../../mastodon/actions/accounts';

const mapStateToProps = (state) => ({
  me: state.getIn(['meta', 'me']),
});

@connect(mapStateToProps)
export default class FollowButton extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    me: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
  };

  handleFollow = () => {
    const { dispatch, account } = this.props;

    if (account.getIn(['relationship', 'following'])) {
      dispatch(unfollowAccount(account.get('id')));
    } else {
      dispatch(followAccount(account.get('id')));
    }
  }

  render () {
    const { account, me } = this.props;

    if (!me) {
      return (
        <Button className='follow' href={`/users/${account.get('acct')}/remote_follow`}>
          <FormattedMessage id='account.remote_follow' defaultMessage='Remote follow' />
        </Button>
      );
    }

    if (me !== account.get('id') && account.get('relationship')) {
      if (account.getIn(['relationship', 'requested'])) {
        return (
          <Button className='follow' disabled>
            <FormattedMessage id='account.requested' defaultMessage='Awaiting approval' />
          </Button>
        );
      } else if (!account.getIn(['relationship', 'blocking'])) {
        const type = (account.getIn(['relationship', 'following'])) ? 'unfollow' : 'follow';
        const message = type === 'follow' ? (
          <FormattedMessage id='account.follow' defaultMessage='Follow' />
        ) : (
          <FormattedMessage id='account.unfollow' defaultMessage='Unfollow' />
        );

        return (
          <Button className={type} onClick={this.handleFollow}>
            {message}
          </Button>
        );
      }
    }

    return null;
  }

};
