import React from 'react';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import IconButton from '../../../components/icon_button';

class EventCalender extends React.PureComponent {

  static propTypes = {
    events: ImmutablePropTypes.list.isRequired,
  };

  calcRemainingDays (date) {
    const nowTime = Date.now();
    const diffTime = date.getTime() - nowTime;
    const dateUnix = 24 * 60 * 60 * 1000;

    const remainingDays = Math.floor(diffTime / dateUnix);
    if (remainingDays < 0) return '';
    if (remainingDays === 0) return '当日';
    return `残り${remainingDays}日`;
  }

  getDisplayDateText (date, duration) {
    const weekday = ['日', '月', '火', '水', '木', '金', '土'];
    let dateString = `${date.getMonth() + 1}/${date.getDate()} (${weekday[date.getDay()]})`;
    if (duration > 1) {
      const dateUnix = 24 * 60 * 60 * 1000;
      const endDate = new Date(date.getTime() + dateUnix * duration - 1);
      dateString += ` ~ ${endDate.getMonth() + 1}/${endDate.getDate()} (${weekday[endDate.getDay()]})`;
    }
    return dateString;
  }

  render () {
    return (
      <div className="event_calendar">
        <div className="event_calendar__header">
          <i className="fa fa-calendar event_calendar__header__icon" aria-hidden="true" />
          <div className="event_calendar__header__name">
            イベントカレンダー
          </div>
        </div>
        <div className="event_calendar__body">
          <ul>
            {this.props.events.map(event => (
              <li key={event.get('name')}>
                <div className="event_calendar__row">
                  <div className="event_calendar__text">
                    <Link className="event_calendar__name" to={`/timelines/tag/${event.get('name')}`}>
                      #{event.get('name')}
                    </Link>
                  </div>
                  <div className='event_calendar__description'>
                    {this.getDisplayDateText(event.get('date'), event.get('duration'))}
                  </div>
                  <div className='event_calendar__description is-remaining-days'>
                    {this.calcRemainingDays(event.get('date'))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

};

export default EventCalender;
