import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ComposeFormContainer from '../../../mastodon/features/compose/containers/compose_form_container';
import scrollTop from '../../../mastodon/scroll';

const mapStateToProps = state => ({
  isLogin: !!state.getIn(['meta', 'me']),
});

@connect(mapStateToProps)
export default class TimelineContainer extends PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
    garally: PropTypes.node.isRequired,
    header: PropTypes.node,
    isLogin: PropTypes.bool,
    withComposeFrom: PropTypes.bool,
  }

  static defaultProps = {
    withComposeFrom: true,
  }

  scrollTop = () => {
    const scrollable = this.node.querySelector('.scrollable');

    if (!scrollable) {
      return;
    }

    this._interruptScrollAnimation = scrollTop(scrollable);
  }

  handleWheel = () => {
    if (typeof this._interruptScrollAnimation !== 'function') {
      return;
    }

    this._interruptScrollAnimation();
  }

  setRef = c => {
    this.node = c;
  }

  render () {
    const { children, garally, withComposeFrom, isLogin } = this.props;

    return (
      <div className='timeline'>
        <div className='timeline-column'>
          {withComposeFrom && isLogin ? <ComposeFormContainer /> : null}
          <div className='timeline-content' ref={this.setRef} onWheel={this.handleWheel}>
            {children}
          </div>
        </div>
        <div className='garally-column'>
          {garally}
        </div>
      </div>
    );
  }

}
