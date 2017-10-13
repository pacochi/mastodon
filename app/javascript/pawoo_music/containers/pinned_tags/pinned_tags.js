import React from 'react';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect }   from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { defineMessages, injectIntl } from 'react-intl';
import { matchPath } from 'react-router';
import HashtagLink from '../../components/hashtag_link';
import TagBox from '../../components/tag_box';
import IconButton from '../../components/icon_button';
import { changeTargetColumn } from '../../actions/column';
import { addColumn, removeColumn } from '../../../mastodon/actions/columns';

const messages = defineMessages({
  title: { id: 'pinned_tags.title', defaultMessage: 'Pinned tags' },
});

const mapStateToProps = state => ({
  target: state.getIn(['pawoo_music', 'column', 'target']),
  tags: state.getIn(['settings', 'columns'], Immutable.List()).filter((column) => column.get('id') === 'HASHTAG'),
  isLogin: !!state.getIn(['meta', 'me']),
});

@injectIntl
@connect(mapStateToProps)
export default class PinnedTags extends ImmutablePureComponent {

  static propTypes = {
    tags: ImmutablePropTypes.list.isRequired,
    isLogin: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object,
  }

  updateOnProps = ['tags', 'isLogin'];

  prevTag = null;

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    return this.getCurrentTag() !== this.prevTag || super.shouldComponentUpdate(nextProps, nextState, nextContext);
  }

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch(changeTargetColumn('lobby'));
  }

  handlePinClick = () => {
    const { dispatch } = this.props;
    const id = this.getCurrentTag();

    dispatch(addColumn('HASHTAG', { id }));
  }

  handleCloseClick = (e) => {
    const { dispatch } = this.props;
    const uuid = e.currentTarget.getAttribute('data-id');

    dispatch(removeColumn(uuid));
  }

  getCurrentTag () {
    // TODO: this.context.router.historyは更新されるので、とりあえずこっちで判定する
    const pathname = this.context.router.history.location.pathname;
    const match = matchPath(pathname, { path: '/tags/:id' });
    return match ? match.params.id : null;
  }

  render () {
    const { tags, intl } = this.props;
    const currentTag = this.getCurrentTag();
    this.prevTag = currentTag;

    return (
      <TagBox className='tag-history' heading={intl.formatMessage(messages.title)}>
        <ul className='rows'>
          {currentTag && tags.every(tag => tag.getIn(['params', 'id']) !== currentTag) && (
            <li key={currentTag} className={classNames('hashtag active')}>
              <HashtagLink hashtag={currentTag} onClick={this.handleClick} />
              <div className='right-box'>
                <IconButton src='map-pin' onClick={this.handlePinClick} />
              </div>
            </li>
          )}
          {tags.reverse().map(tag => {
            const id = tag.getIn(['params', 'id']);
            return (
              <li key={id} className={classNames('hashtag', { active: id === currentTag })}>
                <HashtagLink hashtag={id} onClick={this.handleClick} />
                <div className='right-box'>
                  <IconButton src='x-circle' data-id={tag.get('uuid')} onClick={this.handleCloseClick} />
                </div>
              </li>
            );
          })}
        </ul>
      </TagBox>
    );
  }

};
