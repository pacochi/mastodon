import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedDate, FormattedNumber } from 'react-intl';
import { makeGetStatus } from '../../../mastodon/selectors';
import Timestamp from '../../../mastodon/components/timestamp';
import StatusContent from '../../../mastodon/components/status_content';
import StatusActionBar from '../status_action_bar';
import AccountContainer from '../account';
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
export default class DetailedStatus extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map,
    // fetchBoothItem: PropTypes.func,
    // boothItem: ImmutablePropTypes.map,
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
    const { status, muted } = this.props;
    const { isExpanded } = this.state;
    let applicationLink = null;

    if (!status) {
      return null;
    }

    if (status.get('application')) {
      const website = status.getIn(['application', 'website']);
      const name = status.getIn(['application', 'name']);

      applicationLink = (
        <span>
          {' · '}
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

    return (
      <div className={classNames('detailed-status', { muted }, `status-${status.get('visibility')}`)} data-id={status.get('id')}>
        <div className='status-head'>
          <AccountContainer account={status.get('account')} />
          <a href={status.get('url')} className='status-time' target='_blank' rel='noopener'>
            <Timestamp timestamp={status.get('created_at')} />
          </a>
        </div>

        <StatusMedia status={status} detail />
        <StatusContent status={status} onClick={this.handleClick} expanded={isExpanded} onExpandedToggle={this.handleExpandedToggle} />

        <div className='meta'>
          <a className='absolute-time' href={status.get('url')} target='_blank' rel='noopener'>
            <FormattedDate value={new Date(status.get('created_at'))} hour12={false} year='numeric' month='short' day='2-digit' hour='2-digit' minute='2-digit' />
          </a>
          {applicationLink}
          {' · '}
          <Link to={`/@${status.getIn(['account', 'acct'])}/${status.get('id')}/reblogs`}>
            <i className='fa fa-retweet' />
            <FormattedNumber value={status.get('reblogs_count')} />
          </Link>
          {' · '}
          <Link to={`/@${status.getIn(['account', 'acct'])}/${status.get('id')}/favourites`}>
            <i className='fa fa-star' />
            <FormattedNumber value={status.get('favourites_count')} />
          </Link>
        </div>

        <StatusActionBar status={status} />
      </div>
    );
  }

}
