import React, { PureComponent } from 'react';
import { ScrollContainer } from 'react-router-scroll';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import IntersectionObserverItem from '../intersection_observer_item';
import LoadMore from '../../../mastodon/components/load_more';
import IntersectionObserverWrapper from '../../../mastodon/features/ui/util/intersection_observer_wrapper';

export default class ScrollableList extends PureComponent {

  static propTypes = {
    scrollKey: PropTypes.string.isRequired,
    onScrollToBottom: PropTypes.func,
    onScrollToTop: PropTypes.func,
    onScroll: PropTypes.func,
    shouldUpdateScroll: PropTypes.func,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    prepend: PropTypes.node,
    emptyMessage: PropTypes.node,
    children: PropTypes.node,
  };

  intersectionObserverWrapper = new IntersectionObserverWrapper();

  handleScroll = debounce((e) => {
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
  }, 200, {
    trailing: true,
  });

  componentDidMount () {
    this.attachScrollListener();
    this.attachIntersectionObserver();
  }

  componentDidUpdate (prevProps) {
    // Reset the scroll position when a new child comes in in order not to
    // jerk the scrollbar around if you're already scrolled down the page.
    if (React.Children.count(prevProps.children) < React.Children.count(this.props.children) &&
        this.getFirstChildKey(prevProps) !== this.getFirstChildKey(this.props) &&
        this._oldScrollPosition &&
        this.node.scrollTop > 0) {
      const newScrollTop = this.node.scrollHeight - this._oldScrollPosition;
      if (this.node.scrollTop !== newScrollTop) {
        this.node.scrollTop = newScrollTop;
      }
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

  getFirstChildKey (props) {
    const { children } = props;
    const firstChild = Array.isArray(children) ? children[0] : children;
    return firstChild && firstChild.key;
  }

  setRef = (c) => {
    this.node = c;
  }

  handleLoadMore = (e) => {
    e.preventDefault();
    this.props.onScrollToBottom();
  }

  render () {
    const { children, scrollKey, shouldUpdateScroll, isLoading, hasMore, prepend, emptyMessage } = this.props;
    const hasChildren = React.Children.count(children) > 0;

    const scrollableArea = (isLoading || hasChildren || !emptyMessage) ? (
      <div className='item-list'>
        {prepend}

        {React.Children.map(this.props.children, (child) => (
          <IntersectionObserverItem key={child.key} id={child.key} intersectionObserverWrapper={this.intersectionObserverWrapper}>
            {child}
          </IntersectionObserverItem>
        ))}

        {(!isLoading && hasChildren && hasMore) ? (
          <LoadMore onClick={this.handleLoadMore} />
        ): null}
      </div>
    ) : (
      <div className='empty-column-indicator'>
        {emptyMessage}
      </div>
    );

    return (
      <ScrollContainer scrollKey={scrollKey} shouldUpdateScroll={shouldUpdateScroll}>
        <div className='scrollable' ref={this.setRef}>
          {scrollableArea}
        </div>
      </ScrollContainer>
    );
  }

}
