import React, { PureComponent } from 'react';
import Immutable from 'immutable';
import { connect }   from 'react-redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import { FormattedDate } from 'react-intl';
import HashtagLink from '../hashtag_link';
import TagBox from '../tag_box';
import { changeTargetColumn } from '../../actions/column';

const messages = defineMessages({
  title: { id: 'event_calendar.title', defaultMessage: 'Event Tag Timeline' },
});

const events = Immutable.fromJS([
  {
    start_date: new Date('2017/10/29'),
    hashtag: '2017M3秋',
  },
  {
    start_date: new Date('2017/11/18'),
    end_date: new Date('2017/11/19'),
    hashtag: 'APOLLO07',
  },
  {
    start_date: new Date('2017/12/29'),
    end_date: new Date('2017/12/31'),
    hashtag: 'C93',
  },
]);

// TODO: サーバで設定可能にする

const mapStateToProps = state => ({
  target: state.getIn(['pawoo_music', 'column', 'target']),
});

@injectIntl
@connect(mapStateToProps)
export default class EventCalendar extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  shouldComponentUpdate () {
    return false;
  }

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch(changeTargetColumn('lobby'));
  }

  render () {
    const { intl } = this.props;

    return (
      <TagBox className='event-calendar' heading={intl.formatMessage(messages.title)}>
        <ul>
          {events.map(event => (
            <li key={event.get('hashtag')} className='event'>
              <div className='hashtag'>
                <HashtagLink hashtag={event.get('hashtag')} onClick={this.handleClick} />
              </div>
              <div className='right-box date'>
                <FormattedDate key='start_date' value={event.get('start_date')} month='2-digit' day='2-digit' />
                {event.get('end_date') && ([
                  '-',
                  <FormattedDate key='end_date' value={event.get('end_date')} month='2-digit' day='2-digit' />,
                ])}
              </div>
            </li>
          ))}
        </ul>
      </TagBox>
    );
  }

};
