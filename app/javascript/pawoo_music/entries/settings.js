import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import { ScrollContext } from 'react-router-scroll';
import { Route } from 'react-router-dom';
import { hydrateStore } from '../../mastodon/actions/store';
import configureStore from '../../mastodon/store/configureStore';
import { getLocale } from '../../mastodon/locales';
import UI from '../../mastodon/features/ui';
import Settings from '../components/settings';

const { localeData, messages } = getLocale();
addLocaleData(localeData);

const store = configureStore();
const initialState = JSON.parse(document.getElementById('initial-state').textContent);
store.dispatch(hydrateStore(initialState));

export default class TimelineSettingsEntry extends React.PureComponent {

  static propTypes = {
    locale: PropTypes.string.isRequired,
  };

  render () {
    const { locale } = this.props;

    return (
      <IntlProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <BrowserRouter basename='/settings'>
            <ScrollContext>
              <UI className='settings' intent>
                <Route path='/' component={Settings} />
              </UI>
            </ScrollContext>
          </BrowserRouter>
        </Provider>
      </IntlProvider>
    );
  }

}
