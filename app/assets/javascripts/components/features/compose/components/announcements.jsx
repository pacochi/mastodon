import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import IconButton from '../../../components/icon_button';

const storageKey = 'announcements_dismissed';

const message = (() => {
  const m = new SpeechSynthesisUtterance();
  m.rate = 1.2;
  m.volume = 1;
  m.pitch = 1.3;
  m.lang = 'ja-JP';
  m.text = ' '

  return m;
})();

setTimeout(() => {
  window.speechSynthesis.speak(message); // 一度話さないとvoiceリストが取得できない
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang == 'ja-JP');
  message.voice = voices[0];
});

const translations = {
  '': /http(s)?:\/\/[\x21-\x7e]+/gi,
  'パウー': /pawoo/ig,
  'わらわら': /(w|ｗ){2}/g,
  'わら': /(w|ｗ)$/g,
};

const translate = (text) => {
  for (let key in translations) {
    let regexp = translations[key];
    console.log(regexp);
    text = text.replace(regexp, key);
  }

  return text;
};

const stopSpeeker = () => {
  console.log('stopSpeeker')
  message.volume = 0;
  message.onerror = message.onend = () => {};
  window.speechSynthesis.cancel();
}

// Load on load
stopSpeeker();

let previous = '';
const speekSpeeker = (text) => {
  console.log('speekSpeeker')
  message.volume = 1;

  if (text == previous) {
    setTimeout(message.onend, 500);
  } else {
    previous = text;
    message.text = translate(text);
    window.speechSynthesis.speak(message);
  }
}

class Announcements extends React.PureComponent {

  constructor (props, context) {
    super(props, context);

    this.handleDismiss = this.handleDismiss.bind(this);
    this.onSpeekStop = this.onSpeekStop.bind(this);
    this.onSpeekLocal = this.onSpeekLocal.bind(this);
    this.onSpeekHome = this.onSpeekHome.bind(this);

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

  onSpeekStop() {
    this.stopped = true;
    stopSpeeker();
    message.onend = message.onerror = function() {};
    window.location.reload();
  }

  onSpeekLocal() {
    if (message.onend !== this.onSpeekLocal) {
      stopSpeeker();
      message.onend = message.onerror = this.onSpeekLocal;
    }

    let timeline = $(".status-list").last()
    const localTimeline = $(`[aria-labelledby="ローカルタイムライン"]`);

    if (localTimeline.length > 0) {
      timeline = localTimeline;
    }

    const text = timeline.find('.status__content').first().text();
    if (!this.stopped) speekSpeeker(text);
  }

  onSpeekHome() {
    if (message.onend !== this.onSpeekHome) {
      stopSpeeker();
      message.onend = message.onerror = this.onSpeekHome;
    }

    let timeline = $(".status-list").last()
    const localTimeline = $(`[aria-labelledby="ホームタイムライン"]`);

    if (localTimeline.length > 0) {
      timeline = localTimeline;
    }

    const text = timeline.find('.status__content').first().text();
    if (!this.stopped) speekSpeeker(text);
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
            reactRouter: false,
            inline: true,
            href: 'https://itunes.apple.com/us/app/%E3%83%9E%E3%82%B9%E3%83%88%E3%83%89%E3%83%B3%E3%82%A2%E3%83%97%E3%83%AA-pawoo/id1229070679?l=ja&ls=1&mt=8',
            body: 'Appストア'
          }, {
            reactRouter: false,
            inline: true,
            href: 'https://play.google.com/store/apps/details?id=jp.pxv.pawoo&hl=ja',
            body: 'Google Playストア'
          }
        ]
      }, {
        id: 4,
        icon: '/announcements/icon_2x_360.png',
        body: '開催中の企画に参加しよう！',
        link: [
          {
            reactRouter: true,
            inline: false,
            href: '/timelines/tag/pawoo人増えたし自己紹介しようぜ',
            body: '#pawoo人増えたし自己紹介しようぜ'
          }
        ]
      }, {
        id: 7,
        icon: '/announcements/icon_2x_360.png',
        body: 'Pawooにどんなユーザーさんがいるのか見てみよう！',
        link: [
          {
            reactRouter: true,
            inline: false,
            href: '/suggested_accounts',
            body: 'おすすめユーザー（実験中）'
          }
        ]
      }, {
        id: 8,
        icon: '/announcements/icon_2x_360.png',
        body: '[超実験中] ホームタイムラインを読み上げる機能を追加しました',
        link: [
          {
            reactRouter: false,
            inline: false,
            say: true,
            timeline: 'Home',
            body: 'ホームタイムラインを読み上げる'
          }, {
            onClick: this.onSpeekLocal,
            reactRouter: false,
            inline: false,
            say: true,
            timeline: 'Local',
            body: 'ローカルタイムラインを読み上げる'
          }, {
            reactRouter: false,
            inline: false,
            say: true,
            timeline: 'Stop',
            body: '読み上げを停止する'
          }
        ]
      }
      // NOTE: id: 8 まで使用した
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
                {announcement.get('link').map((link) => {
                  const classNames = ['announcements__link']

                  if (link.get('inline')) {
                    classNames.push('announcements__link-inline')
                  }


                  if (link.get('say')) {
                    let func = this[`onSpeek${link.get('timeline')}`]

                    return (
                      <a onClick={func} style={{ cursor: 'pointer' }} key={link.get('timeline')} className={classNames.join(' ')}>
                        {link.get('body')}
                      </a>
                    );
                  } else if (link.get('reactRouter')) {
                    return (
                      <Link key={link.get('href')} className={classNames.join(' ')} to={link.get('href')}>
                        {link.get('body')}
                      </Link>
                    );
                  } else {
                    return (
                      <a className={classNames.join(' ')} key={link.get('href')} href={link.get('href')} target='_blank'>
                        {link.get('body')}
                      </a>
                    );
                  }
                })}
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
