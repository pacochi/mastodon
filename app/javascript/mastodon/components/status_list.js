import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ScrollContainer } from 'react-router-scroll';
import PropTypes from 'prop-types';
import StatusContainer from '../containers/status_container';
import LoadMore from './load_more';
import ImmutablePureComponent from 'react-immutable-pure-component';
import IntersectionObserverWrapper from '../features/ui/util/intersection_observer_wrapper';

class StatusList extends ImmutablePureComponent {

  static propTypes = {
    scrollKey: PropTypes.string.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    onScrollToBottom: PropTypes.func,
    onScrollToTop: PropTypes.func,
    onScroll: PropTypes.func,
    trackScroll: PropTypes.bool,
    shouldUpdateScroll: PropTypes.func,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    prepend: PropTypes.node,
    emptyMessage: PropTypes.node,
    expandMedia: PropTypes.bool,
    squareMedia: PropTypes.bool,
    standalone: PropTypes.bool,
    displayPinned: PropTypes.bool,
  };

  static defaultProps = {
    trackScroll: true,
    expandMedia: false,
    squareMedia: false,
    standalone: false,
    displayPinned: false,
  };

  intersectionObserverWrapper = new IntersectionObserverWrapper();

  handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const offset = scrollHeight - scrollTop - clientHeight;
    this._oldScrollPosition = scrollHeight - scrollTop;

    if (250 > offset && this.props.onScrollToBottom && !this.props.isLoading) {
      this.props.onScrollToBottom();
    } else if (scrollTop < 100 && this.props.onScrollToTop) {
      this.props.onScrollToTop();
    } else if (this.props.onScroll) {
      this.props.onScroll();
    }
  }

  componentDidMount () {
    this.attachScrollListener();
    this.attachIntersectionObserver();
  }

  componentDidUpdate (prevProps) {
    if ((prevProps.statusIds.size < this.props.statusIds.size && prevProps.statusIds.first() !== this.props.statusIds.first() && !!this._oldScrollPosition) && this.node.scrollTop > 0) {
      this.node.scrollTop = this.node.scrollHeight - this._oldScrollPosition;
    }
  }

  componentWillUnmount () {
    this.detachScrollListener();
    this.detachIntersectionObserver();
  }

  attachIntersectionObserver () {
    this.intersectionObserverWrapper.connect({
      root: this.node,
      rootMargin: '300% 0px',
    });
  }

  detachIntersectionObserver () {
    this.intersectionObserverWrapper.disconnect();
  }

  attachScrollListener () {
    this.node.addEventListener('scroll', this.handleScroll);
  }

  detachScrollListener () {
    this.node.removeEventListener('scroll', this.handleScroll);
  }

  setRef = (c) => {
    this.node = c;
  }

  handleLoadMore = (e) => {
    e.preventDefault();
    this.props.onScrollToBottom();
  }

  render () {
<<<<<<< HEAD
    const { statusIds, onScrollToBottom, scrollKey, shouldUpdateScroll, isLoading, isUnread, hasMore, prepend, emptyMessage, squareMedia, expandMedia, standalone, displayPinned } = this.props;
    const { isIntersecting } = this.state;
=======
    const { statusIds, onScrollToBottom, scrollKey, trackScroll, shouldUpdateScroll, isLoading, hasMore, prepend, emptyMessage } = this.props;
>>>>>>> 947887f261f74f84312327a5265553e8f16655fe

    let loadMore       = null;
    let scrollableArea = null;

    if (!isLoading && statusIds.size > 0 && hasMore) {
      loadMore = <LoadMore onClick={this.handleLoadMore} />;
    }

    if (isLoading || statusIds.size > 0 || !emptyMessage) {
      scrollableArea = (
        <div className='scrollable' ref={this.setRef}>
          <div className='status-list'>
            {prepend}

            {statusIds.map((statusId) => {
<<<<<<< HEAD
              return <StatusContainer key={statusId} id={statusId} isIntersecting={isIntersecting[statusId]} onRef={this.handleStatusRef} squareMedia={squareMedia} expandMedia={expandMedia} standalone={standalone} displayPinned={displayPinned} />;
=======
              return <StatusContainer key={statusId} id={statusId} intersectionObserverWrapper={this.intersectionObserverWrapper} />;
>>>>>>> 947887f261f74f84312327a5265553e8f16655fe
            })}

            {loadMore}
          </div>
        </div>
      );
    } else {
      scrollableArea = (
        <div className='empty-column-indicator' ref={this.setRef}>
          {emptyMessage}
        </div>
      );
    }

    if (trackScroll) {
      return (
        <ScrollContainer scrollKey={scrollKey} shouldUpdateScroll={shouldUpdateScroll}>
          {scrollableArea}
        </ScrollContainer>
      );
    } else {
      return scrollableArea;
    }
  }

}

export default StatusList;
