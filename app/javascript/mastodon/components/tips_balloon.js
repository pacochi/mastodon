import React from 'react';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import IconButton from './icon_button';

const storageKey = 'tips_balloon';

// メモ: id 3まで使用

class TipsBalloon extends React.PureComponent {

  static propTypes = {
    id: React.PropTypes.number.isRequired,
    dismiss: React.PropTypes.bool.isRequired,
    onDismiss: React.PropTypes.func.isRequired,
    style: React.PropTypes.object,
    children: React.PropTypes.node.isRequired,
  };

  static defaultProps = {
    style: {},
  };

  handleDismiss = (event) => {
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
