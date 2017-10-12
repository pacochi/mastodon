import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedDate, FormattedNumber } from 'react-intl';
import Link from '../link_wrapper';

export default class StatusMeta extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
  };

  render () {
    const { status } = this.props;
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
      <div className='meta'>

        <Link className='absolute-time' to={`/@${status.getIn(['account', 'acct'])}/${status.get('id')}`}>
          <FormattedDate value={new Date(status.get('created_at'))} hour12={false} year='numeric' month='short' day='2-digit' hour='2-digit' minute='2-digit' />
        </Link>
        {applicationLink}
        {' \u00A0 '}
        <span>
          <i className='fa fa-retweet' />
          <FormattedNumber value={status.get('reblogs_count')} />
        </span>
        {' \u00A0 '}
        <span>
          <i className='fa fa-star' />
          <FormattedNumber value={status.get('favourites_count')} />
        </span>
      </div>
    );
  }

}
