import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  minutes: { id: 'time_limit.minutes', defaultMessage: '{minutes, number} {minutes, plural, one {minute} other {minutes}}' },
  hours: { id: 'time_limit.hours', defaultMessage: '{hours, number} {hours, plural, one {hour} other {hours}}' },
  select_time_limit: { id: 'time_limit.select_time_limit', defaultMessage: 'Select time limit' },
});

const dropdownStyle = {
  position: 'absolute',
  right: '3px',
  top: '35px'
};

class TimeLimitDropdown extends React.PureComponent {

  constructor (props, context) {
    super(props, context);
    this.setRef = this.setRef.bind(this);
  }

  handleClick (value) {
    this.dropdown.hide();
    this.props.onSelectTimeLimit(value);
  }

  setRef (c) {
    this.dropdown = c;
  }

  render () {
    const { intl } = this.props;

    const options = [
      { value: '#1m', text: intl.formatMessage(messages.minutes, { minutes: 1 }) },
      { value: '#5m', text: intl.formatMessage(messages.minutes, { minutes: 5 }) },
      { value: '#10m', text: intl.formatMessage(messages.minutes, { minutes: 10 }) },
      { value: '#30m', text: intl.formatMessage(messages.minutes, { minutes: 30 }) },
      { value: '#1h', text: intl.formatMessage(messages.hours, { hours: 1 }) },
    ];

    return (
      <Dropdown className='time-limit-dropdown' ref={this.setRef} style={dropdownStyle}>
        <DropdownTrigger className='icon-button inverted' title={intl.formatMessage(messages.select_time_limit)}>
          <i className={`fa fa-fw fa-clock-o`} aria-hidden='true' />
        </DropdownTrigger>

        <DropdownContent className='dropdown__left'>
          <div className='time-limit-dropdown__dropdown'>
            {options.map(item =>
              <div role='button' tabIndex='0' key={item.value} onClick={this.handleClick.bind(this, item.value)} className='time-limit-dropdown__option'>
                <div className='time-limit-dropdown__option__content'>
                  <strong>{item.text}</strong>
                </div>
              </div>
            )}
          </div>
        </DropdownContent>
      </Dropdown>
    );
  }

}

TimeLimitDropdown.propTypes = {
  onSelectTimeLimit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
};

export default injectIntl(TimeLimitDropdown);
