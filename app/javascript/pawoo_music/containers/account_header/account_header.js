import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { injectIntl, defineMessages, FormattedMessage, FormattedNumber } from 'react-intl';
import { NavLink } from 'react-router-dom';
import emojify from '../../../mastodon/emoji';
import Avatar from '../../components/avatar';
import DisplayName from '../../components/display_name';
import Button from '../../components/button';
import { followAccount, unfollowAccount } from '../../../mastodon/actions/accounts';
import DropdownMenu from '../../../mastodon/components/dropdown_menu';

const messages = defineMessages({
  mention: { id: 'account.mention', defaultMessage: 'Mention @{name}' },
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  unmute: { id: 'account.unmute', defaultMessage: 'Unmute @{name}' },
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  report: { id: 'account.report', defaultMessage: 'Report @{name}' },
  media: { id: 'account.media', defaultMessage: 'Media' },
  disclaimer: { id: 'account.disclaimer', defaultMessage: 'This user is from another instance. This number may be larger.' },
  blockDomain: { id: 'account.block_domain', defaultMessage: 'Hide everything from {domain}' },
  unblockDomain: { id: 'account.unblock_domain', defaultMessage: 'Unhide {domain}' },
});


const mapStateToProps = (state) => ({
  me: state.getIn(['meta', 'me']),
  autoPlayGif: state.getIn(['meta', 'auto_play_gif']),
});

@injectIntl
@connect(mapStateToProps)
export default class AccountHeader extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    me: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    autoPlayGif: PropTypes.bool,
  };

  handleFollowClick = () => {
    const { dispatch, account } = this.props;

    if (account.getIn(['relationship', 'following'])) {
      dispatch(unfollowAccount(account.get('id')));
    } else {
      dispatch(followAccount(account.get('id')));
    }
  }

  createMenu () {
    const { account, me, intl } = this.props;
    const menu = [];

    if (!me) {
      return menu;
    } else if (me === account.get('id')) {
      menu.push({ text: intl.formatMessage(messages.edit_profile), href: '/settings/profile' });
    } else {
      if (account.getIn(['relationship', 'muting'])) {
        menu.push({ text: intl.formatMessage(messages.unmute, { name: account.get('username') }), action: this.props.onMute });
      } else {
        menu.push({ text: intl.formatMessage(messages.mute, { name: account.get('username') }), action: this.props.onMute });
      }

      if (account.getIn(['relationship', 'blocking'])) {
        menu.push({ text: intl.formatMessage(messages.unblock, { name: account.get('username') }), action: this.props.onBlock });
      } else {
        menu.push({ text: intl.formatMessage(messages.block, { name: account.get('username') }), action: this.props.onBlock });
      }

      menu.push({ text: intl.formatMessage(messages.report, { name: account.get('username') }), action: this.props.onReport });

      if (account.get('acct') !== account.get('username')) {
        const domain = account.get('acct').split('@')[1];
        menu.push(null);

        if (account.getIn(['relationship', 'domain_blocking'])) {
          menu.push({ text: intl.formatMessage(messages.unblockDomain, { domain }), action: this.props.onUnblockDomain });
        } else {
          menu.push({ text: intl.formatMessage(messages.blockDomain, { domain }), action: this.props.onBlockDomain });
        }
      }
    }

    return menu;
  }

  renderProviderIcons () {
    const { account } = this.props;

    return account.getIn(['oauth_authentications'], new Immutable.List()).map(oauth_authentication => {
      const provider = oauth_authentication.get('provider');

      if (provider === 'pixiv') {
        return (
          <a key={provider} href={`https://www.pixiv.net/member.php?id=${oauth_authentication.get('uid')}`} target='_blank' rel='noopener'>
            <div className='oauth-authentication pixiv' />
          </a>
        );
      }

      return <div key={provider} />;
    });
  }

  renderFollowButton () {
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

  render () {
    const { account, me, autoPlayGif, intl } = this.props;

    if (!account) {
      return null;
    }

    const menu = this.createMenu();
    const lockedIcon = account.get('locked') && <i className='fa fa-lock' />;
    const extraInfo = (account.get('acct') !== account.get('username')) && <abbr title={intl.formatMessage(messages.disclaimer)}>*</abbr>;
    const note = { __html: emojify(account.get('note')) };
    let followed = null;

    if (me && me !== account.get('id') && account.getIn(['relationship', 'followed_by'])) {
      followed = (
        <span className='account--follows-info'>
          <FormattedMessage id='account.follows_you' defaultMessage='Follows you' />
        </span>
      );
    }

    return (
      <div className='account-header'>
        <div className='content'>
          <Avatar className='medium' account={account} autoPlayGif={autoPlayGif} />
          <div className='info'>
            <DisplayName account={account} />
            <span className='username'>@{account.get('acct')} {lockedIcon}</span>
            {followed}
            <div className='note' dangerouslySetInnerHTML={note} />
            <div className='action-buttons'>
              {this.renderFollowButton()}
              <div className='oauth-authentications'>
                {this.renderProviderIcons()}
              </div>
            </div>
          </div>
        </div>
        <div className='tabs'>
          <NavLink to={`/@${account.get('acct')}`} exact>
            0album 0trakcs{/* TODO: */}
          </NavLink>
          <NavLink to={`/users/${account.get('acct')}/followers`} exact>
            <span><FormattedMessage id='account.followers' defaultMessage='Followers' /></span>
            <strong><FormattedNumber value={account.get('followers_count')} /> {extraInfo}</strong>
          </NavLink>
          <NavLink to={`/users/${account.get('acct')}/following`} exact>
            <span><FormattedMessage id='account.follows' defaultMessage='Follows' /></span>
            <strong><FormattedNumber value={account.get('following_count')} /> {extraInfo}</strong>
          </NavLink>
          {menu.length > 0 && <DropdownMenu items={menu} icon='bars' size={24} direction='right' />}
        </div>

      </div>
    );
  }

};
