import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  fetchAccount,
  fetchMediaTimeline,
  expandMediaTimeline
} from '../../actions/accounts';
import StatusList from '../../components/status_list';
import LoadingIndicator from '../../components/loading_indicator';
import Column from '../ui/components/column';
import HeaderContainer from './../account_timeline/containers/header_container';
import ColumnBackButton from '../../components/column_back_button';
import Immutable from 'immutable';

const mapStateToProps = (state, props) => ({
  statusIds: state.getIn(['timelines', 'media_timelines', Number(props.params.accountId), 'items'], Immutable.List()),
  isLoading: state.getIn(['timelines', 'media_timelines', Number(props.params.accountId), 'isLoading']),
  hasMore: !!state.getIn(['timelines', 'media_timelines', Number(props.params.accountId), 'next']),
  me: state.getIn(['meta', 'me'])
});

const MediaTimeline = React.createClass({

  propTypes: {
    params: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list,
    isLoading: React.PropTypes.bool,
    hasMore: React.PropTypes.bool,
    me: React.PropTypes.number.isRequired
  },

  mixins: [PureRenderMixin],

  componentWillMount () {
    this.props.dispatch(fetchAccount(Number(this.props.params.accountId)));
    this.props.dispatch(fetchMediaTimeline(Number(this.props.params.accountId)));
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.accountId !== this.props.params.accountId && nextProps.params.accountId) {
      this.props.dispatch(fetchAccount(Number(nextProps.params.accountId)));
      this.props.dispatch(fetchMediaTimeline(Number(nextProps.params.accountId)));
    }
  },

  handleScrollToBottom () {
    this.props.dispatch(expandMediaTimeline(Number(this.props.params.accountId)));
  },

  render () {
    const { statusIds, isLoading, hasMore, me } = this.props;

    if (!statusIds && isLoading) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    return (
      <Column>
        <ColumnBackButton />

        <StatusList
          prepend={<HeaderContainer accountId={this.props.params.accountId} />}
          statusIds={statusIds}
          isLoading={isLoading}
          hasMore={hasMore}
          me={me}
          onScrollToBottom={this.handleScrollToBottom}
        />
      </Column>
    );
  }

});

export default connect(mapStateToProps)(MediaTimeline);
