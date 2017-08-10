import React from 'react';
import Immuatable from 'immutable';
import PropTypes from 'prop-types';
import { IntlProvider, addLocaleData } from 'react-intl';
import ModalRoot from '../features/ui/components/modal_root';
import { getLocale } from '../locales';
const { localeData, messages } = getLocale();

addLocaleData(localeData);


const initialState = JSON.parse(document.getElementById('initial-state').textContent);
const dismissKey = 'pawoo_comiket_92_tag_modal_dismissed';

export default class Announcements extends React.PureComponent {

  static propTypes = {
    locale: PropTypes.string.isRequired,
  };

  componentWillMount () {
    try {
      this.dismissed = localStorage.getItem(dismissKey);
    } catch (e) {}
  }

  handleClose = () => {
    try {
      localStorage.setItem(dismissKey, true);
      this.dismissed = true;
      this.forceUpdate();
    } catch (e) {}
  }

  render () {
    // コミケタグ告知
    const heldComiket = Date.now() < 1502636400000; // 2017/08/14/ 00:00:00 JST
    if (initialState.meta.appmode === 'about' && !this.dismissed && heldComiket) {
      const url = '/announcements/C92pawoo.png';
      const media = Immuatable.fromJS([{
        id: 'pawoo_comiket_92_tag_modal',
        preview_url: url,
        type: 'image',
        url,
      }]);
      const { locale } = this.props;

      return (
        <IntlProvider locale={locale} messages={messages}>
          <ModalRoot type='MEDIA' props={{ media, index: 0, scrollable: true }} onClose={this.handleClose} />
        </IntlProvider>
      );
    }
    return <div />;
  }

}
