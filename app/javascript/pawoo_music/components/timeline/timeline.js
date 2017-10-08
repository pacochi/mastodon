import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GlovalNaviContainer from '../../containers/global_navi';
import classNames from 'classnames';

export default class Timeline extends PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
    garally: PropTypes.node.isRequired,
  }


  render () {
    const { children, garally } = this.props;

    return (
      <div className={classNames('timeline', { mobile : left })}>
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
