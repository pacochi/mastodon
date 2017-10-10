import React, { PureComponent } from 'react';
import { ScrollContainer } from 'react-router-scroll';
import PropTypes from 'prop-types';
import IntersectionObserverArticleContainer from '../../../mastodon/containers/intersection_observer_article_container';
import LoadMore from '../../../mastodon/components/load_more';
import IntersectionObserverWrapper from '../../../mastodon/features/ui/util/intersection_observer_wrapper';
import { throttle } from 'lodash';
import { isMobile } from '../../util/is_mobile';
import { List as ImmutableList } from 'immutable';
import ScrollArea from 'react-scrollbar';

const mobile = isMobile();

export default class ScrollableList extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    scrollKey: PropTypes.string.isRequired,
    onScrollToBottom: PropTypes.func,
    onScrollToTop: PropTypes.func,
    onScroll: PropTypes.func,
    trackScroll: PropTypes.bool,
    shouldUpdateScroll: PropTypes.func,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    prepend: PropTypes.node,
    emptyMessage: PropTypes.node,
    children: PropTypes.node,
  };

  static defaultProps = {
    trackScroll: true,
  };

  state = {
    lastMouseMove: null,
  };

  intersectionObserverWrapper = new IntersectionObserverWrapper();

  handleScroll = throttle((value) => {
    let offset, scrollTop;

    if (mobile) {
      if (!this.content) {
        return;
      }

      const { scrollHeight, clientHeight } = this.content;
      scrollTop = this.content.scrollTop;
      offset = scrollHeight - scrollTop - clientHeight;
      this._oldScrollPosition = scrollHeight - scrollTop;
    } else {
      const { topPosition, realHeight, containerHeight } = value;
      if (typeof topPosition !== 'number' || typeof realHeight !== 'number' || typeof containerHeight !== 'number') {
        return;
      }

      scrollTop = topPosition;
      offset = realHeight - topPosition - containerHeight;
      this._oldScrollPosition = realHeight - topPosition;
    }

    if (400 > offset && this.props.onScrollToBottom && !this.props.isLoading) {
      this.props.onScrollToBottom();
    } else if (scrollTop < 100 && this.props.onScrollToTop) {
      this.props.onScrollToTop();
    } else if (this.props.onScroll) {
      this.props.onScroll();
    }
  }, 150, {
    trailing: true,
  });

  componentDidMount () {
    if (mobile) {
      this.attachScrollListener();
    }
    this.attachIntersectionObserver();
  }

  componentDidUpdate (prevProps) {
    const someItemInserted = React.Children.count(prevProps.children) > 0 &&
      React.Children.count(prevProps.children) < React.Children.count(this.props.children) &&
      this.getFirstChildKey(prevProps) !== this.getFirstChildKey(this.props);

    // Reset the scroll position when a new child comes in in order not to
    // jerk the scrollbar around if you're already scrolled down the page.
    const scrollTop = mobile ? this.content.scrollTop : this.scrollArea.state.topPosition;
    if (someItemInserted && this._oldScrollPosition && scrollTop > 0) {
      const newScrollTop = this.content.scrollHeight - this._oldScrollPosition;

      if (scrollTop !== newScrollTop) {
        if (mobile) {
          this.content.scrollTop = newScrollTop;
        } else {
          this.scrollArea.scrollYTo(newScrollTop);
        }
      }
    } else {
      this._oldScrollPosition = this.content.scrollHeight - scrollTop;
    }
  }

  componentWillUnmount () {
    if (mobile) {
      this.detachScrollListener();
    }
    this.detachIntersectionObserver();
  }

  attachIntersectionObserver () {
    this.intersectionObserverWrapper.connect({
      root: this.wrapper,
      rootMargin: '300% 0px',
    });
  }

  detachIntersectionObserver () {
    this.intersectionObserverWrapper.disconnect();
  }

  attachScrollListener () {
    this.wrapper.addEventListener('scroll', this.handleScroll);
  }

  detachScrollListener () {
    this.wrapper.removeEventListener('scroll', this.handleScroll);
  }

  getFirstChildKey (props) {
    const { children } = props;
    let firstChild = children;
    if (children instanceof ImmutableList) {
      firstChild = children.get(0);
    } else if (Array.isArray(children)) {
      firstChild = children[0];
    }
    return firstChild && firstChild.key;
  }

  setRef = (c) => {
    this.scrollArea = c;
    this.content = c;
    this.wrapper = c;
  }

  setScrollAreaRef = (c) => {
    this.scrollArea = c;
    if (c) {
      this.content = c.content;
      this.wrapper = c.wrapper;
    } else {
      this.content = null;
      this.wrapper = null;
    }
  }

  handleLoadMore = (e) => {
    e.preventDefault();
    this.props.onScrollToBottom();
  }

  handleKeyDown = (e) => {
    if (['PageDown', 'PageUp'].includes(e.key) || (e.ctrlKey && ['End', 'Home'].includes(e.key))) {
      const article = (() => {
        switch (e.key) {
        case 'PageDown':
          return e.target.nodeName === 'ARTICLE' && e.target.nextElementSibling;
        case 'PageUp':
          return e.target.nodeName === 'ARTICLE' && e.target.previousElementSibling;
        case 'End':
          return this.content.querySelector('[role="feed"] > article:last-of-type');
        case 'Home':
          return this.content.querySelector('[role="feed"] > article:first-of-type');
        default:
          return null;
        }
      })();


      if (article) {
        e.preventDefault();
        article.focus();
        article.scrollIntoView();
      }
    }
  }

  render () {
    const { children, scrollKey, trackScroll, shouldUpdateScroll, isLoading, hasMore, prepend, emptyMessage } = this.props;
    const childrenCount = React.Children.count(children);

    const loadMore     = (hasMore && childrenCount > 0) ? <LoadMore visible={!isLoading} onClick={this.handleLoadMore} /> : null;
    let contentArea    = null;

    if (isLoading || childrenCount > 0 || !emptyMessage) {
      contentArea = (
        <div role='feed' className='item-list' onKeyDown={this.handleKeyDown}>
          {prepend}

          {React.Children.map(this.props.children, (child, index) => (
            <IntersectionObserverArticleContainer
              key={child.key}
              id={child.key}
              index={index}
              listLength={childrenCount}
              intersectionObserverWrapper={this.intersectionObserverWrapper}
              saveHeightKey={trackScroll ? `${this.context.router.route.location.key}:${scrollKey}` : null}
            >
              {child}
            </IntersectionObserverArticleContainer>
          ))}

          {loadMore}
        </div>
      );
    } else {
      contentArea = (
        <div role='feed' className='item-list' onKeyDown={this.handleKeyDown}>
          {prepend}

          <div className='empty-column-indicator'>
            {emptyMessage}
          </div>
        </div>
      );
    }

    const content = mobile ? (
      <div className='scrollable' ref={this.setRef}>{contentArea}</div>
    ) : (
      <ScrollArea contentClassName='scrollable' ref={this.setScrollAreaRef} onScroll={this.handleScroll}>{contentArea}</ScrollArea>
    );

    if (trackScroll) {
      return (
        <ScrollContainer scrollKey={scrollKey} shouldUpdateScroll={shouldUpdateScroll}>
          { content }
        </ScrollContainer>
      );
    } else {
      return content;
    }
  }

}
