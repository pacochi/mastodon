import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { makeGetStatus } from '../../../mastodon/selectors';
import StatusContent from '../../../mastodon/components/status_content';
import StatusActionBar from '../status_action_bar';
import AccountContainer from '../account';
import StatusMeta from '../../components/status_meta';
import StatusPrepend from '../../components/status_prepend';
import Track from '../track';

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (state, props) => {
    const { id, status } = props;

    return {
      status: status || getStatus(state, id),
    };
  };

  return mapStateToProps;
};

@connect(makeMapStateToProps)
export default class TrackStatus extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map,
    muted: PropTypes.bool,
    prepend: PropTypes.node,
    hidden: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    isExpanded: false,
  }

  handleExpandedToggle = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  handleClick = () => {
    let { status } = this.props;
    if (status.get('reblog')) {
      status = status.get('reblog');
    }

    this.context.router.history.push(`/@${status.getIn(['account', 'acct'])}/${status.get('id')}`);
  }

  render () {
    const { muted, hidden, prepend, status: originalStatus } = this.props;
    const { isExpanded } = this.state;

    if (!originalStatus) {
      return null;
    }

    let status = originalStatus;
    if (originalStatus.get('reblog', null) !== null && typeof originalStatus.get('reblog') === 'object') {
      status = originalStatus.get('reblog');
    }

    if (!status.has('track') && !status.has('album')) {
      return null;
    }

    if (hidden) {
      return (
        <div>
          {status.getIn(['account', 'display_name']) || status.getIn(['account', 'username'])}
          {status.get('content')}
          {status.getIn(['track', 'artist'])}
          {status.getIn(['track', 'title'])}
        </div>
      );
    }

    return (
      <div className={classNames('track-status', { muted })} data-id={status.get('id')}>
        {prepend || <StatusPrepend className='prepend-inline' status={originalStatus} />}
        <div className='status-head'>
          <AccountContainer account={status.get('account')} />
        </div>

        <Track track={status.get('track')} />

        <StatusContent status={status} onClick={this.handleClick} expanded={isExpanded} onExpandedToggle={this.handleExpandedToggle} />

        <StatusActionBar status={status} />

        <StatusMeta status={status} />
      </div>
    );
  }

}
