import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import IconButton from '../../../components/icon_button';

const storageKey = 'announcements_dismissed';

class Announcements extends React.PureComponent {

  constructor (props, context) {
    super(props, context);

    this.handleDismiss = this.handleDismiss.bind(this);

    try {
      const dismissed = JSON.parse(localStorage.getItem(storageKey));
      this.state = { dismissed: Array.isArray(dismissed) ? dismissed : [] };
    } catch (e) {
      this.state = { dismissed: [] };
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.dismissed !== this.state.dismissed) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(this.state.dismissed));
      } catch (e) {}
    }
  }

  componentWillMount () {
    const announcements = [];

    announcements.push(
      {
        id: 1,
        icon: '/announcements/icon_2x_360.png',
        body: 'PawooのiOS・Android版アプリをリリースしました！！',
        link: [
          {
            href: 'https://itunes.apple.com/us/app/%E3%83%9E%E3%82%B9%E3%83%88%E3%83%89%E3%83%B3%E3%82%A2%E3%83%97%E3%83%AA-pawoo/id1229070679?l=ja&ls=1&mt=8',
            body: 'Appストア'
          }, {
            href: 'https://play.google.com/store/apps/details?id=jp.pxv.pawoo&hl=ja',
            body: 'Google Playストア'
          }
        ]
      }
    );

    this.announcements = Immutable.fromJS(announcements);
  }

  handleDismiss(event) {
    const id = +event.currentTarget.getAttribute('title');

    if (Number.isInteger(id)) {
      this.setState({ dismissed: [].concat(this.state.dismissed, id) });
    }
  }

  render () {
    return (
      <ul className='announcements'>
        {this.announcements.map(announcement => this.state.dismissed.indexOf(announcement.get('id')) === -1 && (
          <li key={announcement.get('id')}>
            <div className='announcements__icon'>
              <img src={announcement.get('icon')} alt='' />
            </div>
            <div className='announcements__body'>
              <div className='announcements__body__dismiss'>
                <IconButton icon='close' title={`${announcement.get('id')}`} onClick={this.handleDismiss} />
              </div>
              <p>{announcement.get('body')}</p>
              <p>
                {
                  announcement.get('link').map((link) =>
                    (
                    <a className='announcements__link' key={link.get('href')} href={link.get('href')} target='_blank'>
                      {link.get('body')}
                    </a>
                    )
                  )
                }
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  }
};

Announcements.propTypes = {
  account: ImmutablePropTypes.map.isRequired
};

export default Announcements;
