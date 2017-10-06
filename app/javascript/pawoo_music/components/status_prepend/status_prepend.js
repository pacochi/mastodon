import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import DisplayName from '../../components/display_name';
import Link from '../../components/link_wrapper';

export default class StatusPrepend extends ImmutablePureComponent {

  static contextTypes = {
    displayPinned: PropTypes.bool,
  };

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
  };

  render () {
    const { status } = this.props;
    const { displayPinned } = this.context;

    if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
      const name = (
        <Link to={`/@${status.getIn(['account', 'acct'])}`}>
          <DisplayName account={status.get('account')} />
        </Link>
      );

      return (
        <div className='status-prepend'>
          <i className='fa fa-fw fa-retweet' />
          <FormattedMessage id='status.reblogged_by' defaultMessage='{name} boosted' values={{ name }} />
        </div>
      );
    } else if (displayPinned && status.get('pinned')) {
      return (
        <div className='status-prepend'>
          <i className='fa fa-fw fa-thumb-tack' />
          <FormattedMessage id='status.pinned' defaultMessage='Pinned Toot' />
        </div>
      );
    }

    return null;
  }

}
