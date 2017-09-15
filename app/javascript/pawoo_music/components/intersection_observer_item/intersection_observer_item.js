import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import scheduleIdleTask from '../../../mastodon/features/ui/util/schedule_idle_task';

export default class IntersectionObserverItem extends ImmutablePureComponent {

  static propTypes = {
    intersectionObserverWrapper: PropTypes.object,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.node,
  };

  state = {
    isIntersecting: true, // assume intersecting until told otherwise
    isHidden: false, // set to true in requestIdleCallback to trigger un-render
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!nextState.isIntersecting && nextState.isHidden) {
      // It's only if we're not intersecting (i.e. offscreen) and isHidden is true
      // that either "isIntersecting" or "isHidden" matter, and then they're
      // the only things that matter.
      return this.state.isIntersecting || !this.state.isHidden;
    } else if (nextState.isIntersecting && !this.state.isIntersecting) {
      // If we're going from a non-intersecting state to an intersecting state,
      // (i.e. offscreen to onscreen), then we definitely need to re-render
      return true;
    }

    // Otherwise, diff based on "updateOnProps" and "updateOnStates"
    return super.shouldComponentUpdate(nextProps, nextState);
  }

  componentDidMount () {
    if (!this.props.intersectionObserverWrapper) {
      // TODO: enable IntersectionObserver optimization for notification statuses.
      // These are managed in notifications/index.js rather than status_list.js
      return;
    }
    this.props.intersectionObserverWrapper.observe(
      this.props.id,
      this.node,
      this.handleIntersection
    );

    this.componentMounted = true;
  }

  componentWillUnmount () {
    this.componentMounted = false;
  }

  handleIntersection = (entry) => {
    if (!this.componentMounted) {
      return;
    }

    // Edge 15 doesn't support isIntersecting, but we can infer it
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12156111/
    // https://github.com/WICG/IntersectionObserver/issues/211
    const isIntersecting = (typeof entry.isIntersecting === 'boolean') ?
      entry.isIntersecting : entry.intersectionRect.height > 0;
    this.setState((prevState) => {
      if (prevState.isIntersecting && !isIntersecting) {
        scheduleIdleTask(this.hideIfNotIntersecting);
      }
      return {
        isIntersecting: isIntersecting,
        isHidden: false,
      };
    });
  }

  hideIfNotIntersecting = () => {
    if (!this.componentMounted) {
      return;
    }

    // When the browser gets a chance, test if we're still not intersecting,
    // and if so, set our isHidden to true to trigger an unrender. The point of
    // this is to save DOM nodes and avoid using up too much memory.
    // See: https://github.com/tootsuite/mastodon/issues/2900
    this.setState((prevState) => ({ isHidden: !prevState.isIntersecting }));
  }

  saveHeight = () => {
    if (this.node && this.node.children.length !== 0) {
      this.height = this.node.getBoundingClientRect().height;
    }
  }

  handleRef = (node) => {
    this.node = node;
    this.saveHeight();
  }

  handleExpandedToggle = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  render () {
    const { children, id } = this.props;
    const { isIntersecting, isHidden } = this.state;

    if (!isIntersecting && isHidden) {
      return (
        <div ref={this.handleRef} style={{ height: `${this.height}px`, opacity: 0, overflow: 'hidden' }} data-id={id} />
      );
    }

    return (
      <div ref={this.handleRef} data-id={id}>
        {children}
      </div>
    );
  }

}
