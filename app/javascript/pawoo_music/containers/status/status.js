import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage, FormattedDate, FormattedNumber } from 'react-intl';
import { makeGetStatus } from '../../../mastodon/selectors';
import Timestamp from '../../../mastodon/components/timestamp';
import StatusContent from '../../../mastodon/components/status_content';
import StatusActionBar from '../status_action_bar';
import AccountContainer from '../account';
import DisplayName from '../../components/display_name';
import StatusMedia from '../status_media';
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
    displayPinned: PropTypes.bool,
    schedule: PropTypes.bool,
  };

  static propTypes = {
    status: ImmutablePropTypes.map,
    muted: PropTypes.bool,
    detail: PropTypes.bool,
    prepend: PropTypes.node,
    // fetchBoothItem: PropTypes.func,
    // boothItem: ImmutablePropTypes.map,
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    detail: false,
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
    const { muted, detail } = this.props;
    const { isExpanded } = this.state;
    const { displayPinned, schedule } = this.context;
    let { status, prepend } = this.props;
    let applicationLink = null;

    if (!status) {
      return null;
    }

    if (!prepend) {
      if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
        const name = (
          <Link to={`/@${status.getIn(['account', 'acct'])}`}>
            <DisplayName account={status.get('account')} />
          </Link>
        );

        prepend = (
          <div className='prepend-inline'>
            <i className='fa fa-fw fa-retweet' />
            <FormattedMessage id='status.reblogged_by' defaultMessage='{name} boosted' values={{ name }} />
          </div>
        );
        status = status.get('reblog');
      } else if (displayPinned && status.get('pinned')) {
        prepend = (
          <div className='prepend-inline'>
            <i className='fa fa-fw fa-thumb-tack' />
            <FormattedMessage id='status.pinned' defaultMessage='Pinned Toot' />
          </div>
        );
      }
    }

    if (status.get('application')) {
      const website = status.getIn(['application', 'website']);
      const name = status.getIn(['application', 'name']);

      applicationLink = (
        <span>
          {' \u00A0 '}
          {website ? (
            <a className='application' href={website} target='_blank' rel='noopener'>
              {name}
            </a>
          ) : (
            name
          )}
        </span>
      );
    }

    const meta = detail && (
      <div className='meta'>
        <a className='absolute-time' href={status.get('url')} target='_blank' rel='noopener'>
          <FormattedDate value={new Date(status.get('created_at'))} hour12={false} year='numeric' month='short' day='2-digit' hour='2-digit' minute='2-digit' />
        </a>
        {applicationLink}
        {' \u00A0 '}
        <Link to={`/@${status.getIn(['account', 'acct'])}/${status.get('id')}/reblogs`}>
          <i className='fa fa-retweet' />
          <FormattedNumber value={status.get('reblogs_count')} />
        </Link>
        {' \u00A0 '}
        <Link to={`/@${status.getIn(['account', 'acct'])}/${status.get('id')}/favourites`}>
          <i className='fa fa-star' />
          <FormattedNumber value={status.get('favourites_count')} />
        </Link>
      </div>
    );

    const highlight = detail || status.get('visibility') === 'direct';

    return (
      <div className={classNames('status', { muted, highlight })} data-id={status.get('id')}>
        {prepend}
        <div className='status-head'>
          <AccountContainer account={status.get('account')} />
          {!detail && (
            <a href={status.get('url')} className='status-time' target='_blank' rel='noopener'>
              <Timestamp schedule={schedule} timestamp={status.get('created_at')} />
            </a>
          )}
        </div>

        <StatusContent status={status} onClick={this.handleClick} expanded={isExpanded} onExpandedToggle={this.handleExpandedToggle} />
        <StatusMedia   status={status} detail={detail} />

        {meta}

        <StatusActionBar status={status} />
      </div>
    );
  }

}
