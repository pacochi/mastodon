import React, { PureComponent } from 'react';
import Immutable from 'immutable';
import { FormattedDate } from 'react-intl';
import HashtagLink from '../hashtag_link';

const events = Immutable.fromJS([
  {
    start_date: new Date('2017/9/18'),
    end_date: new Date('2017/9/20'),
    hashtag: 'mcomi',
  },
  {
    start_date: new Date('2017/10/29'),
    hashtag: '2017M3秋',
  },
]);

// TODO: サーバで設定可能にする

export default class EventCalendar extends PureComponent {

  shouldComponentUpdate () {
    return false;
  }

  render () {
    return (
      <div className='event-calendar'>
        <div className='header'>
          イベントカレンダー
        </div>
        <ul className='rows'>
          {events.map(event => (
            <li key={event.get('hashtag')} className='event'>
              <div className='hashtag'>
                <HashtagLink hashtag={event.get('hashtag')} />
              </div>
              <div className='date'>
                <FormattedDate key='start_date' value={event.get('start_date')} month='2-digit' day='2-digit' />
                {event.get('end_date') && ([
                  '-',
                  <FormattedDate key='end_date' value={event.get('end_date')} month='2-digit' day='2-digit' />,
                ])}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

};
