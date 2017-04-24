import Immutable from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';

const Announcements = React.createClass({
  propTypes: {
    account: ImmutablePropTypes.map.isRequired,
  },

  mixins: [PureRenderMixin],

  componentWillMount () {
    const announcements = [];
    if (this.props.account.get('oauth_authentications').findIndex((a) => a.get('provider') === 'pixiv') === -1) {
      announcements.push({
        icon: '/announcements/icon_2x_360.png',
        body: 'pixivアカウント連携機能を追加しました！ユーザー設定から連携できます',
        link: { href: '/settings/oauth_authentications', body: 'ユーザー設定へ' }
      });
    }
    this.announcements = Immutable.fromJS(announcements);
  },

  render () {
    return (
      <ul className='announcements'>
        {this.announcements.map((announcement, index) => (
          <li key={index}>
            <div className='announcements__icon'>
              <img src={announcement.get('icon')} alt='' />
            </div>
            <div className='announcements__body'>
              <p>{announcement.get('body')}</p>
              {announcement.get('link') &&
                <a href={announcement.getIn(['link', 'href'])} target='_blank'>
                  {announcement.getIn(['link', 'body'])}
                </a>
              }
            </div>
          </li>
        ))}
      </ul>
    );
  }
});

export default Announcements;
