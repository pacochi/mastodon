import React from 'react';
import ComposeFormContainer from './containers/compose_form_container';
import UploadFormContainer from './containers/upload_form_container';
import NavigationContainer from './containers/navigation_container';
import TrendTagsContainer from './containers/trend_tags_container';
import AnnouncementsContainer from './containers/announcements_container';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { mountCompose, unmountCompose } from '../../actions/compose';
import Link from 'react-router/lib/Link';
import { injectIntl, defineMessages } from 'react-intl';
import SearchContainer from './containers/search_container';
import Motion from 'react-motion/lib/Motion';
import spring from 'react-motion/lib/spring';
import SearchResultsContainer from './containers/search_results_container';

const messages = defineMessages({
  start: { id: 'getting_started.heading', defaultMessage: 'Getting started' },
  public: { id: 'navigation_bar.public_timeline', defaultMessage: 'Federated timeline' },
  community: { id: 'navigation_bar.community_timeline', defaultMessage: 'Local timeline' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
});

const mapStateToProps = state => ({
  showSearch: state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden']),
<<<<<<< HEAD:app/assets/javascripts/components/features/compose/index.jsx
  submitting: state.getIn(['compose', 'is_submitting'])
=======
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc:app/javascript/mastodon/features/compose/index.js
});

class Compose extends React.PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    withHeader: PropTypes.bool,
    showSearch: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount () {
    this.props.dispatch(mountCompose());
  }

  componentDidUpdate (prevProps) {
    if (this.props.intent && prevProps.submitting && !this.props.submitting) {
      window.close();
      // Cannot close window unless it opened by JavaScript.
      setTimeout(() => (location.href = '/'), 240);
    }
  }

  componentWillUnmount () {
    this.props.dispatch(unmountCompose());
  }

  render () {
    if (this.props.intent) {
      return (
        <div className='compose-form__intent'>
          <div style={{ maxWidth: 400, width: '100%' }}>
            <NavigationContainer />
            <ComposeFormContainer />
          </div>
        </div>
      );
    }

    const { withHeader, showSearch, intl } = this.props;

    let header = '';

    if (withHeader) {
      header = (
        <div className='drawer__header'>
          <Link to='/getting-started' className='drawer__tab' title={intl.formatMessage(messages.start)}><i role="img" aria-label={intl.formatMessage(messages.start)} className='fa fa-fw fa-asterisk' /></Link>
          <Link to='/timelines/public/local' className='drawer__tab' title={intl.formatMessage(messages.community)}><i role="img" aria-label={intl.formatMessage(messages.community)} className='fa fa-fw fa-users' /></Link>
          <Link to='/timelines/public' className='drawer__tab' title={intl.formatMessage(messages.public)}><i role="img" aria-label={intl.formatMessage(messages.public)} className='fa fa-fw fa-globe' /></Link>
          <a href='/settings/preferences' className='drawer__tab' title={intl.formatMessage(messages.preferences)}><i role="img" aria-label={intl.formatMessage(messages.preferences)} className='fa fa-fw fa-cog' /></a>
          <a href='/auth/sign_out' className='drawer__tab' data-method='delete' title={intl.formatMessage(messages.logout)}><i role="img" aria-label={intl.formatMessage(messages.logout)} className='fa fa-fw fa-sign-out' /></a>
        </div>
      );
    }

    return (
      <div className='drawer'>
        {header}

        <SearchContainer />

        <div className='drawer__pager'>
          <div className='drawer__inner'>
            <div className="drawer__block">
              <NavigationContainer />
              <ComposeFormContainer />
            </div>
            <AnnouncementsContainer />
            <div className="drawer__block">
              <TrendTagsContainer />
            </div>
          </div>

          <Motion defaultStyle={{ x: -100 }} style={{ x: spring(showSearch ? 0 : -100, { stiffness: 210, damping: 20 }) }}>
            {({ x }) =>
              <div className='drawer__inner darker' style={{ transform: `translateX(${x}%)`, visibility: x === -100 ? 'hidden' : 'visible' }}>
                <SearchResultsContainer />
              </div>
            }
          </Motion>
        </div>
      </div>
    );
  }

}

<<<<<<< HEAD:app/assets/javascripts/components/features/compose/index.jsx
Compose.propTypes = {
  dispatch: PropTypes.func.isRequired,
  withHeader: PropTypes.bool,
  intent: PropTypes.bool,
  showSearch: PropTypes.bool,
  submitting: PropTypes.bool,
  intl: PropTypes.object.isRequired
};

=======
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc:app/javascript/mastodon/features/compose/index.js
export default connect(mapStateToProps)(injectIntl(Compose));
