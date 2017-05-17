import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl';
import AccountContainer from '../../../containers/account_container';
import StatusContainer from '../../../containers/status_container';
import { Link } from 'react-router';

class SearchResults extends React.PureComponent {

  render () {
    const { results, searchKeyword, intl } = this.props;

    let accounts, statuses, hashtags, search_link;
    let count = 0;

    if (results.get('accounts') && results.get('accounts').size > 0) {
      count   += results.get('accounts').size;
      accounts = (
        <div className='search-results__section'>
          {results.get('accounts').map(accountId => <AccountContainer key={accountId} id={accountId} />)}
        </div>
      );
    }

    if (results.get('statuses') && results.get('statuses').size > 0) {
      count   += results.get('statuses').size;
      statuses = (
        <div className='search-results__section'>
          {results.get('statuses').map(statusId => <StatusContainer key={statusId} id={statusId} />)}
        </div>
      );
    }

    if (results.get('hashtags') && results.get('hashtags').size > 0) {
      count += results.get('hashtags').size;
      hashtags = (
        <div className='search-results__section'>
          {results.get('hashtags').map(hashtag =>
            <Link className='search-results__hashtag' to={`/timelines/tag/${hashtag}`}>
              #{hashtag}
            </Link>
          )}
        </div>
      );
    }

    if (searchKeyword.length > 0) {
      search_link = (
        <Link className='search-results__search-toots' to={`/statuses/search/${searchKeyword}`}>
          <i className='fa fa-fw fa-search' />
          <FormattedMessage id='search_results.search_toots' defaultMessage={"Search toots with \"{query}\""} values={{ query: searchKeyword }} />
        </Link>
      );
    }

    return (
      <div className='search-results'>
        {search_link}
        {accounts}
        {statuses}
        {hashtags}
      </div>
    );
  }

}

SearchResults.propTypes = {
  results: ImmutablePropTypes.map.isRequired,
  searchKeyword: PropTypes.string
};

export default injectIntl(SearchResults);
