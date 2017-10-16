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
  };

  static defaultProps = {
    style: {},
  };

  handleDismiss = () => {
    this.props.onDismiss(this.props.id);
  }

  render () {
    return (!this.props.dismiss &&
      <div className='tips-balloon' style={this.props.style}>
        <div className='tips-balloon__content'>
          {this.props.children}
        </div>
        <div className='tips-balloon__dismiss'>
          <IconButton icon='close' title='閉じる' onClick={this.handleDismiss} />
        </div>
      </div>
    );
  }

};

export default TipsBalloon;
