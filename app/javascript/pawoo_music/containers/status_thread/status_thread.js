import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { ScrollContainer } from 'react-router-scroll';
import { fetchStatus } from '../../../mastodon/actions/statuses';
import { fetchAccount, fetchFollowers, expandFollowers } from '../../../mastodon/actions/accounts';
import AccountHeaderContainer from '../account_header';
import { makeGetAccount, makeGetStatus } from '../../../mastodon/selectors';
import StatusContainer from '../../../mastodon/containers/status_container';
import DetailedStatus from '../../../mastodon/features/status/components/detailed_status';
import ActionBar from '../../../mastodon/features/status/components/action_bar';
import AccountTimelineContainer from '../account_timeline';

const mapStateToProps = (state, props) => {
  const acct = props.match.params.acct;
  const statusId = Number(props.match.params.id);
  const accountId = Number(state.getIn(['acct_map', acct]));
  const getAccount = makeGetAccount();
  const getStatus = makeGetStatus();

  return {
    accountId,
    statusId,
    account: getAccount(state, accountId),
    status: getStatus(state, statusId),
    ancestorsIds: state.getIn(['contexts', 'ancestors', statusId]),
    descendantsIds: state.getIn(['contexts', 'descendants', statusId]),
    me: state.getIn(['meta', 'me']),
    boostModal: state.getIn(['meta', 'boost_modal']),
    deleteModal: state.getIn(['meta', 'delete_modal']),
    autoPlayGif: state.getIn(['meta', 'auto_play_gif']),
  };
};

@connect(mapStateToProps)
export default class StatusThread extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    accountId: PropTypes.number.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    statusId: PropTypes.number.isRequired,
    status: ImmutablePropTypes.map,
    ancestorsIds: ImmutablePropTypes.list,
    descendantsIds: ImmutablePropTypes.list,
    me: PropTypes.number,
    boostModal: PropTypes.bool,
    deleteModal: PropTypes.bool,
    autoPlayGif: PropTypes.bool,
  };

  componentWillMount () {
  }


  componentDidMount () {
    const { dispatch, accountId, statusId } = this.props;

    dispatch(fetchAccount(accountId));
    dispatch(fetchFollowers(accountId));
    dispatch(fetchStatus(statusId));
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch } = this.props;

    if (nextProps.accountId !== this.props.accountId && nextProps.accountId) {
      const accountId = nextProps.accountId;

      dispatch(fetchAccount(accountId));
      dispatch(fetchFollowers(accountId));
    }
  }

  handleScrollToBottom = debounce(() => {
    const { dispatch, accountId } = this.props;
    dispatch(expandFollowers(accountId));
  }, 300, { leading: true });

  renderChildren (list) {
    return list.map(id => <StatusContainer key={id} id={id} />);
  }

  render () {
    const { status, account, ancestorsIds, descendantsIds, me, autoPlayGif } = this.props;

    if (!status) {
      return null;
    }

    const ancestors = (ancestorsIds && ancestorsIds.size > 0) && (
      <div>{this.renderChildren(ancestorsIds)}</div>
    );
    const descendants = (descendantsIds && descendantsIds.size > 0) && (
      <div>{this.renderChildren(descendantsIds)}</div>
    );

    const Garally = (
      <div className='garally'>
        <ScrollContainer scrollKey='thread'>
          <div className='scrollable'>
            <AccountHeaderContainer account={account} />
            {ancestors}

            <DetailedStatus
              status={status}
              autoPlayGif={autoPlayGif}
              me={me}
              onOpenVideo={this.handleOpenVideo}
              onOpenMedia={this.handleOpenMedia}
            />

            {/* TODO */}
            <ActionBar
              status={status}
              me={me}
              onReply={this.handleReplyClick}
              onFavourite={this.handleFavouriteClick}
              onReblog={this.handleReblogClick}
              onDelete={this.handleDeleteClick}
              onMention={this.handleMentionClick}
              onReport={this.handleReport}
            />

            {descendants}
          </div>
        </ScrollContainer>
      </div>
    );

    return (
      <AccountTimelineContainer garally={Garally} {...this.props} />
    );
  }

};
