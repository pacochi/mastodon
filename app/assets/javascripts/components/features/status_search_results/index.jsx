import {connect} from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types'
import Immutable from 'immutable';
import {
  fetchStatusSearchTimeline,
  expandStatusSearchTimeline
} from '../../actions/search';
import Column from '../ui/components/column';
import {defineMessages, injectIntl, FormattedMessage} from 'react-intl';
import ColumnBackButtonSlim from '../../components/column_back_button_slim';
import LoadingIndicator from '../../components/loading_indicator';
import StatusList from '../../components/status_list';

const messages = defineMessages({
  title: {id: 'column.statusSearchResults', defaultMessage: 'Status search results'}
});

const mapStateToProps = (state, props) => ({
  statusIds: state.getIn(['timelines', 'status_search_timelines', String(props.params.keyword), 'items'], Immutable.List()),
  isLoading: state.getIn(['timelines', 'status_search_timelines', String(props.params.keyword), 'isLoading']),
  hasMore: true,
});

let subscription;

class StatusSearchResults extends React.PureComponent {

  constructor (props, context) {
    super(props, context);
    this.handleScrollToBottom = this.handleScrollToBottom.bind(this);
  }

  componentWillMount (){
    this.props.dispatch(fetchStatusSearchTimeline(String(this.props.params.keyword)));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.keyword !== this.props.params.keyword && nextProps.params.keyword) {
      this.props.dispatch(fetchStatusSearchTimeline(String(nextProps.params.keyword)));
    }
  }

  handleScrollToBottom () {
    if (!this.props.isLoading && this.props.hasMore) {
      this.props.dispatch(expandStatusSearchTimeline(String(this.props.params.keyword)));
    }
  }

  render () {
    const { intl, statusIds, isLoading, hasMore } = this.props;

    if (!statusIds && isLoading) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    return (
      <Column icon='globe'  heading={intl.formatMessage(messages.title)}>
        <ColumnBackButtonSlim />
        <StatusList
          scrollKey='status_search_results'
          statusIds={statusIds}
          isLoading={isLoading}
          hasMore={hasMore}
          onScrollToBottom={this.handleScrollToBottom}
        />
      </Column>
    );
  }

};

StatusSearchResults.propTypes = {
  intl: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  statusIds: ImmutablePropTypes.list,
  isLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
};

export default connect(mapStateToProps)(injectIntl(StatusSearchResults));
