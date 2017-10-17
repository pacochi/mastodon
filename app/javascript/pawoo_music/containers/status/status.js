import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { makeGetStatus } from '../../../mastodon/selectors';
import Timestamp from '../../../mastodon/components/timestamp';
import StatusContent from '../../../mastodon/components/status_content';
import StatusActionBar from '../status_action_bar';
import AccountContainer from '../account';
import StatusMedia from '../status_media';
import StatusMeta from '../../components/status_meta';
import StatusPrepend from '../../components/status_prepend';
import Link from '../../components/link_wrapper';

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
export default class Status extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
    schedule: PropTypes.bool,
  };

  static propTypes = {
    status: ImmutablePropTypes.map,
    muted: PropTypes.bool,
    detail: PropTypes.bool,
    hidden: PropTypes.bool,
    prepend: PropTypes.node,
    // fetchBoothItem: PropTypes.func,
    // boothItem: ImmutablePropTypes.map,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    detail: false,
  }

  state = {
    isExpanded: false,
  }

  handleExpandedToggle = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  render () {
    const { muted, detail, hidden, prepend, status: originalStatus } = this.props;
    const { isExpanded } = this.state;
    const { schedule } = this.context;

    if (!originalStatus) {
      return null;
    }

    let status = originalStatus;
    if (originalStatus.get('reblog', null) !== null && typeof originalStatus.get('reblog') === 'object') {
      status = originalStatus.get('reblog');
    }

    if (hidden) {
      return (
        <div>
          {status.getIn(['account', 'display_name']) || status.getIn(['account', 'username'])}
          {status.get('content')}
        </div>
      );
    }

    const highlight = detail || status.get('visibility') === 'direct';

    return (
      <Link to={`/@${status.getIn(['account', 'acct'])}/${status.get('id')}`}>
        <div className={classNames('status', { muted, highlight })} data-id={status.get('id')}>
          {prepend || <StatusPrepend className='prepend-inline' status={originalStatus} />}
          <div className='status-head'>
            <AccountContainer account={status.get('account')} />
            {!detail && (
              <Timestamp absolute={schedule} timestamp={status.get('created_at')} />
            )}
          </div>

          <StatusContent status={status} expanded={isExpanded} onExpandedToggle={this.handleExpandedToggle} />
          <StatusMedia   status={status} detail={detail} />

          {detail && <StatusMeta status={status} />}

          <StatusActionBar status={status} />
        </div>
      </Link>
    );
  }

}
