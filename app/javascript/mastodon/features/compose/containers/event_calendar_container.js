import { connect }   from 'react-redux';
import Immutable from 'immutable';
import EventCalendar from '../components/event_calendar';

const mapStateToProps = () => {
  return {
    events: Immutable.fromJS([
      {
        date: new Date('2017/9/18'),
        name: 'mcomi',
        duration: 1,
      },
      {
        date: new Date('2017/10/29'),
        name: '2017M3秋',
        duration: 1,
      },
    ]),
  };
};

export default connect(mapStateToProps)(EventCalendar);
