import React from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {
  fetchStatusSearchTimeline,
  expandStatusSearchTimeline
} from '../../actions/search';
import Column from '../ui/components/column';
import { FormattedMessage } from 'react-intl';
import ColumnBackButtonSlim from '../../components/column_back_button_slim';
import LoadingIndicator from '../../components/loading_indicator';
import StatusList from '../../components/status_list';

const mapStateToProps = (state, props) => ({
  statusIds: state.getIn(['timelines', 'status_search_timelines', props.params.keyword, 'items'], Immutable.List()),
  isLoading: state.getIn(['timelines', 'status_search_timelines', props.params.keyword, 'isLoading']),
  hasMore: state.getIn(['timelines', 'status_search_timelines', props.params.keyword, 'hasMore']),
});

class StatusSearchResults extends React.PureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
  };

  componentWillMount (){
    this.props.dispatch(fetchStatusSearchTimeline(this.props.params.keyword));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.keyword !== this.props.params.keyword && nextProps.params.keyword) {
      this.props.dispatch(fetchStatusSearchTimeline(nextProps.params.keyword));
    }
  }

  handleScrollToBottom = () => {
    if (!this.props.isLoading && this.props.hasMore) {
      this.props.dispatch(expandStatusSearchTimeline(this.props.params.keyword));
    }
  }

  render () {
    const { statusIds, isLoading, params } = this.props;
    const keyword = params.keyword;
    const column_header = <FormattedMessage id='column.search_toots' defaultMessage='Search: "{keyword}"' values={{ keyword }} />;

    if (!statusIds && isLoading) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    return (
      <Column icon='search' heading={column_header}>
        <ColumnBackButtonSlim />
        <StatusList
          scrollKey='status_search_results'
          statusIds={statusIds}
          isLoading={isLoading}
          onScrollToBottom={this.handleScrollToBottom}
          emptyMessage={<FormattedMessage id='empty_column.search_toots' defaultMessage='No toots found.' />}
        />
      </Column>
    );
  }

};

export default connect(mapStateToProps)(StatusSearchResults);
