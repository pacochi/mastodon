import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GlovalNaviContainer from '../../containers/global_navi';

export default class Timeline extends PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
    garally: PropTypes.node.isRequired,
    isLogin: PropTypes.bool,
  }


  render () {
    const { children, garally } = this.props;

    return (
      <div className='timeline'>
        <div className='navigation-column'>
          <GlovalNaviContainer />
        </div>
        <div className='lobby-column'>
          {children}
        </div>
        <div className='garally-column'>
          {garally}
        </div>
      </div>
    );
  }

}
