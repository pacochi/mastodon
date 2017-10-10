import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect }   from 'react-redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import HashtagLink from '../../components/hashtag_link';
import TagBox from '../../components/tag_box';
import { changeTargetColumn } from '../../actions/column';

// TODO: 現在はピンしたタグを表示している

const messages = defineMessages({
  title: { id: 'pinned_tags.title', defaultMessage: 'Pinned tags' },
});

const mapStateToProps = state => ({
  target: state.getIn(['pawoo_music', 'column', 'target']),
  tags: state.getIn(['settings', 'columns']).filter((column) => column.get('id') === 'HASHTAG').map((column) => column.getIn(['params', 'id'])),
});

@injectIntl
@connect(mapStateToProps)
export default class TagHistory extends ImmutablePureComponent {

  static propTypes = {
    tags: ImmutablePropTypes.list.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch(changeTargetColumn('lobby'));
  }

  render () {
    const { tags, intl } = this.props;

    return (
      <TagBox className='tag-history' heading={intl.formatMessage(messages.title)}>
        <ul className='rows'>
          {tags.map(tag => (
            <li key={tag} className='hashtag'>
              <HashtagLink hashtag={tag} onClick={this.handleClick} />
            </li>
          ))}
        </ul>
      </TagBox>
    );
  }

};
