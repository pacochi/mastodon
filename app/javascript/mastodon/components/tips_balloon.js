import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import IconButton from './icon_button';

// メモ: id 3まで使用

class TipsBalloon extends React.PureComponent {

  static propTypes = {
    id: PropTypes.number.isRequired,
    dismiss: PropTypes.bool.isRequired,
    onDismiss: PropTypes.func.isRequired,
    style: PropTypes.object,
    children: PropTypes.node.isRequired,
    position: PropTypes.oneOf(['left', 'center']),
    direction: PropTypes.oneOf(['bottom', 'top']),
  };

  static defaultProps = {
    style: {},
    position: 'left',
    direction: 'bottom',
  };

  handleDismiss = () => {
    this.props.onDismiss(this.props.id);
  }

  render () {
    const { dismiss, style, children, position, direction } = this.props;

    return !dismiss && (
      <div className={classNames('tips-balloon', `position-${position}`, `direction-${direction}`)} style={style}>
        <div className='tips-balloon__content'>
          {children}
        </div>
        <div className='tips-balloon__dismiss'>
          <IconButton icon='close' title='閉じる' onClick={this.handleDismiss} />
        </div>
      </div>
    );
  }

};

export default TipsBalloon;
