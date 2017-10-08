import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GlovalNaviContainer from '../../containers/global_navi';
import classNames from 'classnames';

const mapStateToProps = state => ({
  target: state.getIn(['pawoo_music', 'column', 'target']),
});

@connect(mapStateToProps)
export default class Timeline extends PureComponent {

  static propTypes = {
    target: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    garally: PropTypes.node.isRequired,
  }


  render () {
    const { target, children, garally } = this.props;
    console.log(target);

    return (
      <div className={classNames('timeline', {})}>
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
