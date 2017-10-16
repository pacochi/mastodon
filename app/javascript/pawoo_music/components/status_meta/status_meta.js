import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedNumber } from 'react-intl';
import Timestamp from '../../../mastodon/components/timestamp';
import IconButton from '../icon_button';
import Link from '../link_wrapper';

export default class StatusMeta extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
  };

  static contextTypes = {
    schedule: PropTypes.bool,
  };

  render () {
    const { status } = this.props;
    const { schedule } = this.context;
    let applicationLink = null;

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

    return (
      <div className='status-meta'>

        <Link className='absolute-time' to={`/@${status.getIn(['account', 'acct'])}/${status.get('id')}`}>
          <Timestamp schedule={schedule} timestamp={status.get('created_at')} />
        </Link>
        {applicationLink}
        {' \u00A0 '}
        <span>
          <IconButton src='repeat' strokeWidth={2} />
          <FormattedNumber value={status.get('reblogs_count')} />
        </span>
        {' \u00A0 '}
        <span>
          <IconButton src='heart' strokeWidth={2} />
          <FormattedNumber value={status.get('favourites_count')} />
        </span>
      </div>
    );
  }

}
