import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GlobalNavi from '../../components/global_navi';
import ComposeFormContainer from '../../../mastodon/features/compose/containers/compose_form_container';
import { mountCompose, unmountCompose } from '../../../mastodon/actions/compose';
import scrollTop from '../../../mastodon/scroll';

const mapStateToProps = state => ({
  isLogin: !!state.getIn(['meta', 'me']),
});

@connect(mapStateToProps)
export default class Timeline extends PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
    garally: PropTypes.node.isRequired,
    header: PropTypes.node,
    isLogin: PropTypes.bool,
    withComposeForm: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    withComposeForm: true,
  }

  componentDidMount () {
    const { dispatch, withComposeForm } = this.props;
    if (withComposeForm) {
      dispatch(mountCompose());
    }
  }

  componentDidUpdate (prevProps) {
    const { dispatch, withComposeForm } = this.props;

    if (prevProps.withComposeForm !== withComposeForm) {
      if (withComposeForm) {
        dispatch(mountCompose());
      } else {
        dispatch(unmountCompose());
      }
    }
  }

  componentWillUnmount () {
    const { dispatch } = this.props;
    dispatch(unmountCompose());
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
    const { children, garally, withComposeForm, isLogin } = this.props;

    return (
      <div className='timeline'>
        <div className='navigation-column'>
          <GlobalNavi isLogin={isLogin} />
        </div>
        <div className='timeline-column'>
          {withComposeForm && isLogin && <ComposeFormContainer />}
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
