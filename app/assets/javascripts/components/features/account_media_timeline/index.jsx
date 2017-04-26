import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  fetchAccount,
  fetchAccountMediaTimeline,
  expandAccountMediaTimeline
} from '../../actions/accounts';
import StatusList from '../../components/status_list';
import LoadingIndicator from '../../components/loading_indicator';
import Column from '../ui/components/column';
import HeaderContainer from './../account_timeline/containers/header_container';
import ColumnBackButton from '../../components/column_back_button';
import Immutable from 'immutable';

const mapStateToProps = (state, props) => ({
  statusIds: state.getIn(['timelines', 'account_media_timelines', Number(props.params.accountId), 'items'], Immutable.List()),
  isLoading: state.getIn(['timelines', 'account_media_timelines', Number(props.params.accountId), 'isLoading']),
  hasMore: !!state.getIn(['timelines', 'account_media_timelines', Number(props.params.accountId), 'next']),
  me: state.getIn(['meta', 'me'])
});

const AccountMediaTimeline = React.createClass({

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
    this.props.dispatch(fetchAccountMediaTimeline(Number(this.props.params.accountId)));
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.accountId !== this.props.params.accountId && nextProps.params.accountId) {
      this.props.dispatch(fetchAccount(Number(nextProps.params.accountId)));
      this.props.dispatch(fetchAccountMediaTimeline(Number(nextProps.params.accountId)));
    }
  },

  handleScrollToBottom () {
    this.props.dispatch(expandAccountMediaTimeline(Number(this.props.params.accountId)));
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
          expand
        />
      </Column>
    );
  }

});

export default connect(mapStateToProps)(AccountMediaTimeline);
