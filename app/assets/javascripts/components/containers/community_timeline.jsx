import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import { IntlProvider, addLocaleData } from 'react-intl';
import { hydrateStore } from '../actions/store';
import getMessagesForLocale from '../locales';
import UI from '../features/ui';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import eo from 'react-intl/locale-data/eo';
import es from 'react-intl/locale-data/es';
import fi from 'react-intl/locale-data/fi';
import fr from 'react-intl/locale-data/fr';
import hu from 'react-intl/locale-data/hu';
import it from 'react-intl/locale-data/it';
import ja from 'react-intl/locale-data/ja';
import pt from 'react-intl/locale-data/pt';
import nl from 'react-intl/locale-data/nl';
import no from 'react-intl/locale-data/no';
import ru from 'react-intl/locale-data/ru';
import uk from 'react-intl/locale-data/uk';
import zh from 'react-intl/locale-data/zh';
import bg from 'react-intl/locale-data/bg';
import { localeData as zh_hk } from '../locales/zh-hk';
import pt_br from '../locales/pt-br';

const store = configureStore();
store.dispatch(hydrateStore({}));

addLocaleData([
  ...en,
  ...de,
  ...eo,
  ...es,
  ...fi,
  ...fr,
  ...hu,
  ...it,
  ...ja,
  ...pt,
  ...pt_br,
  ...nl,
  ...no,
  ...ru,
  ...uk,
  ...zh,
  ...zh_hk,
  ...bg,
]);

import PureRenderMixin from 'react-addons-pure-render-mixin';
import StatusListContainer from '../features/ui/containers/status_list_container';
import Column from '../features/ui/components/column';
import {
  refreshTimeline,
  // updateTimeline,
  // deleteFromTimelines,
  // connectTimeline,
  // disconnectTimeline
} from '../actions/timelines';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import createStream from '../stream';

const messages = defineMessages({
  title: { id: 'column.community', defaultMessage: 'Local timeline' }
});

const mapStateToProps = state => ({
  hasUnread: state.getIn(['timelines', 'community', 'unread']) > 0,
  streamingAPIBaseURL: state.getIn(['meta', 'streaming_api_base_url']),
  accessToken: state.getIn(['meta', 'access_token'])
});

let subscription;

const CommunityTimeline = React.createClass({

  propTypes: {
    intl: React.PropTypes.object.isRequired,
    streamingAPIBaseURL: React.PropTypes.string.isRequired,
    accessToken: React.PropTypes.string.isRequired,
    hasUnread: React.PropTypes.bool
  },

  mixins: [PureRenderMixin],

  componentDidMount () {
    // const { dispatch, streamingAPIBaseURL, accessToken } = this.props;

    store.dispatch(refreshTimeline('community'));

    if (typeof subscription !== 'undefined') {
      return;
    }

    // subscription = createStream(streamingAPIBaseURL, accessToken, 'public:local', {
    //
    //   connected () {
    //     store.dispatch(connectTimeline('community'));
    //   },
    //
    //   reconnected () {
    //     store.dispatch(connectTimeline('community'));
    //   },
    //
    //   disconnected () {
    //     store.dispatch(disconnectTimeline('community'));
    //   },
    //
    //   received (data) {
    //     switch(data.event) {
    //     case 'update':
    //       store.dispatch(updateTimeline('community', JSON.parse(data.payload)));
    //       break;
    //     case 'delete':
    //       store.dispatch(deleteFromTimelines(data.payload));
    //       break;
    //     }
    //   }
    //
    // });
  },

  componentWillUnmount () {
    // if (typeof subscription !== 'undefined') {
    //   subscription.close();
    //   subscription = null;
    // }
  },

  render () {
    const { intl, hasUnread } = this.props;

    return (
      <IntlProvider locale='en' messages={getMessagesForLocale('en')}>
        <Provider store={store}>
          <UI intent>
            <Column icon='users' active heading=''>
              <StatusListContainer type='community' emptyMessage='' />
            </Column>
          </UI>
        </Provider>
      </IntlProvider>
    );
  },

});

export default injectIntl(CommunityTimeline);
