import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconButton from '../../../components/icon_button';
import api from '../../../api';
import createStream from '../../../../mastodon/stream';
import TipsBalloonContainer from '../../../containers/tips_balloon_container';
import TweetButton from '../../../components/tweet_button';
import YouTubeArtwork from './youtube_artwork';
import SoundCloudArtwork from './soundcloud_artwork';
import VideoArtwork from './video_artwork';
import AudioArtwork from './audio_artwork';

const PlatformHelp = () => {
  const platforms = [
    {
      icon: '/player/logos/pawoo-music.svg',
      title: 'Pawoo Music',
      url: 'https://music.pawoo.net/web/statuses/[XXXXX…]',
    },
    {
      icon: '/player/logos/youtube.svg',
      title: 'YouTube',
      url: 'https://www.youtube.com/watch?v=[XXXXX……]',
    },
    {
      icon: '/player/logos/booth.svg',
      title: 'BOOTH',
      url: 'https://booth.pm/ja/items/[XXXXX……]',
    },
    {
      icon: '/player/logos/apollo.png',
      title: 'APOLLO',
      url: 'https://booth.pm/apollo/a06/item?id=[XXXXX……]',
    },
    {
      icon: '/player/logos/soundcloud.svg',
      title: 'SoundCloud',
      url: 'https://soundcloud.com/[username]/[trackname]',
    },
  ];

  return (
    <div className='deck__queue-add-form-help'>
      <i className='fa fa-question-circle deck__queue-add-form-help-icon' />
      <div className='deck__queue-add-form-help-popup'>
        <h3>対応プラットフォーム</h3>
        <ul>
          {platforms.map(({ icon, title, url }) => (
            <li key={title}>
              <img src={icon} />
              <div className='platform-info'>
                <div className='platform-info__title'>{title}</div>
                <div className='platform-info__url'>{url}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const LoadingArtwork = () => (
  <div className="queue-item__artwork">
    <div className='loading' />
  </div>
);

class PlaylistController extends React.PureComponent {

  static propTypes = {
    offsetStartTime: PropTypes.number.isRequired,
    isTop: PropTypes.bool.isRequired,
    isActive: PropTypes.bool.isRequired,
    muted: PropTypes.bool.isRequired,
    volume: PropTypes.number.isRequired,
    duration: PropTypes.number,
    skipLimitTime: PropTypes.number,
    onSkip: PropTypes.func.isRequired,
    onToggleMute: PropTypes.func.isRequired,
    onChangeVolume: PropTypes.func.isRequired,
  };

  static defaultProps = {
    duration: 0,
    skipLimitTime: 0,
  };

  state = {
    timeOffset: Math.floor(new Date() / 1000 - this.props.offsetStartTime),
  };
  interval = null;
  volumeList = [
    { value: 1,    text: '100%' },
    { value: 0.75, text: '75%'  },
    { value: 0.5,  text: '50%'  },
    { value: 0.25, text: '25%'  },
  ];

  componentDidMount () {
    this.interval = setInterval(() => {
      const { offsetStartTime } = this.props;
      this.setState({
        timeOffset: Math.floor(new Date() / 1000 - offsetStartTime),
      });
    }, 300);
  }

  componentWillUnmount () {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  isSkipEnable () {
    const { isActive, skipLimitTime } = this.props;
    const { timeOffset } = this.state;
    return isActive && skipLimitTime && timeOffset > skipLimitTime;
  }

  handleClickSkip = () => {
    if(this.isSkipEnable()) {
      this.props.onSkip();
    }
  }

  handleSelectVolume = (e) => {
    const volume = Number(e.currentTarget.getAttribute('data-volume'));
    this.props.onChangeVolume(volume);
  }

  render () {
    const { isTop, isActive, duration, muted, volume } = this.props;
    const { timeOffset } = this.state;

    const time = Math.min(timeOffset, duration);

    return (
      <div className='control-bar__controller'>
        <div className='control-bar__controller-toggle-wrapper'>
          <div className={`control-bar__controller-toggle is-${muted ? 'pause' : 'playing'}`} onClick={this.props.onToggleMute}>
            <i className={`fa ${muted ? 'fa-play' : 'fa-volume-up'}`} />
          </div>
          <div className='control-bar__volume-selector'>
            <ul>
              {this.volumeList.map(({ value, text }) => (
                <li key={value} className={classNames('control-bar__volume-selector__item', { active: value === volume })} data-volume={value} onClick={this.handleSelectVolume}>{text}</li>
              ))}
            </ul>
          </div>
        </div>
        {!isTop && <TipsBalloonContainer id={1}>
          音楽を再生！
        </TipsBalloonContainer>}

        {isActive && !isTop && <div className='control-bar__controller-skip'>
          <span className={this.isSkipEnable() ? '' : 'disabled'} onClick={this.handleClickSkip}>SKIP</span>
        </div>}

        {isActive && <div className='control-bar__controller-info'>
          <span className='control-bar__controller-now'>{Math.floor(time / 60)}:{('0' + (time % 60)).slice(-2)}</span>
          <span className='control-bar__controller-separater'>/</span>
          <span className='control-bar__controller-time'>{Math.floor(duration / 60)}:{('0' + (duration % 60)).slice(-2)}</span>
        </div>}
      </div>
    );
  }

}

class PlayControl extends React.PureComponent {

  static propTypes = {
    accessToken: PropTypes.string.isRequired,
    streamingAPIBaseURL: PropTypes.string.isRequired,
    isTop: PropTypes.bool.isRequired,
    onError: PropTypes.func.isRequired,
    onSkip: PropTypes.func.isRequired,
  };

  constructor (props, context) {
    super(props, context);

    this.CONST_DECKS = [
      {number: 1, type: 'DECK', name: '共有チャンネル1', icon: '/player/pawoo-music-playlist-icon.svg'},
      {number: 2, type: 'DECK', name: '共有チャンネル2', icon: '/player/pawoo-music-playlist-icon.svg'},
      {number: 3, type: 'DECK', name: '共有チャンネル3', icon: '/player/pawoo-music-playlist-icon.svg'},
      {number: 4, type: 'DECK', name: '共有チャンネル4', icon: '/player/pawoo-music-playlist-icon.svg'},
      {number: 5, type: 'DECK', name: '共有チャンネル5', icon: '/player/pawoo-music-playlist-icon.svg'},
      {number: 346, type: 'DECK', name: 'Pawoo Music\nチャンネル', icon: '/player/pawoo-music-playlist-icon.svg'},
    ];

    let targetDeck = 1;
    try { targetDeck = Number(localStorage.getItem('LATEST_DECK')) || 1; } catch (err) {}
    if (!this.CONST_DECKS.find((deck) => deck.number === targetDeck)) {
      targetDeck = this.CONST_DECKS[0].number;
    }
    let volume = 1;
    try { volume = Number(localStorage.getItem('player_volume')) || 1; } catch (err) {}

    this.state = {
      isOpen: false,
      isPlaying: false,
      isSp: window.innerWidth < 1024,
      targetDeck,
      volume,
      deck: null,
      playlist: (new Array(10)).fill(null),
      player: null,
      timeOffset: 0,
      offsetStartTime: 0,
      isSeekbarActive: false,
      isLoadingArtwork: true,
      muted: true,
    };

    this.subscription = null;
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResizeWindow);

    if(this.state.isSp) return;
    this.fetchDeck(this.state.targetDeck);
    this.setSubscription(this.state.targetDeck);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResizeWindow);
  }

  createPlaylist (deck) {
    const queues = ((deck && deck.queues) || []);
    return queues.concat((new Array(10 - queues.length)).fill(null));
  }

  setSubscription (target) {
    // TODO: ソケットが正しくクローズされているかをしっかり調査する
    if(this.subscription) this.subscription.close();
    this.subscription = createStream(this.props.streamingAPIBaseURL, this.props.accessToken, `playlist&deck=${target}`, {
      received: (data) => {
        switch(data.event) {
        case 'add':
          {
            const payload = JSON.parse(data.payload);
            const deck = Object.assign({}, this.state.deck);
            deck.queues.push(payload);
            this.setState({
              deck,
              playlist: this.createPlaylist(deck),
            });
          }
          break;
        case 'play':
          {
            const deck = Object.assign({}, this.state.deck);
            if(deck.queues.length >= 2) deck.queues.shift();
            deck.time_offset = 0;
            this.playNextQueueItem(deck, (new Date().getTime() / 1000));
          }
          break;
        case 'end':
          {
            const deck = Object.assign({}, this.state.deck);
            if(deck.queues.length <= 1) deck.queues = [];
            deck.time_offset = 0;

            this.setState({
              deck,
              playlist: this.createPlaylist(deck),
              isYoutubeLoadingDone: false,
              isPlaying: false,
            });
          }
          break;
        }
      },
    });
  }

  playNextQueueItem (deck, offsetStartTime) {
    this.setState({
      deck,
      playlist: this.createPlaylist(deck),
      isSeekbarActive: false,
      isLoadingArtwork: true,
      isPlaying: false,
      offsetStartTime,
      timeOffset: deck.time_offset,
      isYoutubeLoadingDone: false,
    });

    // Animation用の遅延ローディング
    setTimeout(()=>{
      this.setState({
        isSeekbarActive:true,
        isLoadingArtwork: false,
        isPlaying: this.isDeckActive(),
      });
    }, 20);
  }

  fetchDeck(id) {
    return api(this.getMockState).get(`/api/v1/playlists/${id}`)
      .then((response) => {
        this.playNextQueueItem(response.data.deck, (new Date().getTime() / 1000) - response.data.deck.time_offset);
      })
      .catch((error) => {
        this.props.onError(error);
      });
  }

  handleClickDeck = () => {
    this.setState({isOpen: true});
  }

  handleClickOverlay = () => {
    this.setState({isOpen: false});
  }

  handleClickDeckTab = (e) => {
    const number = Number(e.currentTarget.getAttribute('data-number'));
    if(number === this.state.targetDeck) return;
    if (this.isLoading()) return;

    try { localStorage.setItem('LATEST_DECK', number); } catch (err) {}

    this.setState({
      targetDeck: number,
      isSeekbarActive: false,
      isLoadingArtwork: true,
      isPlaying: false,
    });
    this.fetchDeck(number);
    this.setSubscription(number);
  }

  handleSubmitAddForm = (e) => {
    e.preventDefault();
    return api(this.getMockState).post(`/api/v1/playlists/${this.state.targetDeck}/deck_queues`, {link: this.urlRef.value})
      .then((response)=>{
        this.urlRef.value = "";
      })
      .catch((error)=>{
        this.props.onError(error);
      });
  }

  handleClickToggleMute = () => {
    this.setState({ muted: (!this.state.muted) });
  }

  handleClickSkip = () => {
    if (this.isDeckActive()) {
      this.props.onSkip(this.state.targetDeck, this.state.deck.queues[0].id);
    }
  }

  handleChangeVolume = (volume) => {
    this.setState({ volume });
    try { localStorage.setItem('player_volume', volume); } catch (err) {}
  }

  handleCancelOpenDeck = (e) => {
    // クリック時にDeckが開かないように
    e.stopPropagation();
  }

  handleResizeWindow = (e) => {
    const isSp = window.innerWidth < 1024;
    if (this.state.isSp !== isSp) {
      this.setState({ isSp });
    }
  }

  getMockState = () => {
    return {
      getIn: () => this.props.accessToken,
    };
  }

  setURLRef = (c) => {
    this.urlRef = c;
  }

  getDeckFirstQueue() {
    const { deck } = this.state;
    return deck && deck.queues && deck.queues[0];
  }

  isDeckActive () {
    return Boolean(this.getDeckFirstQueue());
  }

  isLoading () {
    const { isLoadingArtwork, isYoutubeLoadingDone } = this.state;
    const deckQueue = this.getDeckFirstQueue();

    return isLoadingArtwork || (deckQueue && deckQueue.source_type === 'youtube' && !isYoutubeLoadingDone);
  }

  handleReadyYoutube = () => {
    this.setState({
      isYoutubeLoadingDone: true,
    });
  }

  renderDeckQueueCaption(text) {
    const queueItem = this.getDeckFirstQueue();
    const shareText = `いまみんなで一緒に${queueItem ? `「${queueItem.info}」` : '音楽'}を聞きながら談話しています。`;
    return (
      <div className='deck__queue-caption'>
        <span>{text}</span>
        <div onClick={this.handleCancelOpenDeck} style={{ display: 'inline-block', marginLeft: '3px', verticalAlign: 'bottom' }}>
          <TweetButton text={shareText} url='https://music.pawoo.net/' />
        </div>
      </div>
    );
  }

  renderQueueItem = (queue_item, i) => {
    const { deck } = this.state;
    const queues = ((deck && deck.queues) || []);

    return (
      <li key={queue_item ? queue_item.id : `empty-queue-item_${i}`} className="deck__queue-item">
        <div className="queue-item__main">
          <div>
            {!this.state.isOpen && i === 0 && this.renderDeckQueueCaption('- いまみんなで一緒に聞いている曲 -')}
            <div className='queue-item__metadata'>
              {queues.length === 0 && i === 0 ? (
                <span>プレイリストに好きな曲を入れてね！</span>
              ) : (queue_item && (
                <span className='queue-item__metadata-title'>{queue_item.info.length > 40 ? `${queue_item.info.slice(0, 40)}……` : queue_item.info}</span>
              ))}
            </div>
          </div>
        </div>
        <div className='queue-item__datasource'>
          {queue_item && (
            <a href={queue_item.link} target="_blank" onClick={this.handleCancelOpenDeck}>
              <img src={`/player/logos/${queue_item.source_type}.${queue_item.source_type === 'apollo' ? 'png' : 'svg'}`} />
            </a>
          )}
        </div>
      </li>
    );
  }

  renderArtwork () {
    const { deck, isLoadingArtwork, isPlaying, timeOffset, muted, volume } = this.state;
    const deckQueue = this.getDeckFirstQueue();

    if (isLoadingArtwork) {
      return <LoadingArtwork />;
    }

    if (!deckQueue || !isPlaying) {
      return <div className="queue-item__artwork" />;
    }

    switch (deckQueue.source_type) {
    case 'youtube':
      return <YouTubeArtwork muted={muted} volume={volume} timeOffset={timeOffset} videoId={deckQueue.source_id} onReadyYoutube={this.handleReadyYoutube}/>;
    case 'soundcloud':
      return <SoundCloudArtwork muted={muted} volume={volume} timeOffset={timeOffset} sourceId={deckQueue.source_id} />;
    case 'pawoo-music':
      return <VideoArtwork muted={muted} volume={volume} timeOffset={timeOffset} videoUrl={deckQueue.video_url} />;
    case 'booth':
    case 'apollo':
      return <AudioArtwork muted={muted} volume={volume} timeOffset={timeOffset} musicUrl={deckQueue.music_url} thumbnailUrl={deckQueue.thumbnail_url} />;
    default:
      return <div className="queue-item__artwork" />;
    }
  }

  render () {
    if(this.state.isSp) return null;
    const { isTop } = this.props;
    const { playlist, targetDeck, deck, offsetStartTime, muted, volume, isSeekbarActive, isOpen, timeOffset } = this.state;

    const deckQueue = this.getDeckFirstQueue();
    const sourceType = deckQueue && deckQueue.source_type;
    const duration = deckQueue && deckQueue.duration;
    const skipLimitTime = deck && deck.skip_limit_time;

    const index = this.CONST_DECKS.findIndex((deck) => deck.number === targetDeck);
    const isApollo = this.CONST_DECKS[index].type === 'APOLLO';
    const deckSelectorStyle = {
      transform: `translate(0, -${(this.state.isOpen) ? 0 : index * 56}px)`,
    };
    const playerClass = classNames('player-control', {
      'is-open': isOpen,
      'is-apollo': isApollo,
    });

    let playerSeekBarStyle = {};
    if (deckQueue) {
      if (isSeekbarActive) {
        playerSeekBarStyle = {
          transition: `width ${isSeekbarActive ? (deckQueue.duration - timeOffset) : '0'}s linear`,
        };
      } else {
        playerSeekBarStyle = {
          transition: `width 0s linear`,
          width: `${deckQueue.duration ? (timeOffset / deckQueue.duration) * 100 : 0}%`,
        };
      }
    }

    return (
      <div className={playerClass}>
        <div className='player-control__control-bar'>
          <PlaylistController
            offsetStartTime={offsetStartTime}
            isTop={isTop}
            isActive={this.isDeckActive()}
            muted={muted}
            duration={duration}
            volume={volume}
            skipLimitTime={skipLimitTime}
            onSkip={this.handleClickSkip}
            onToggleMute={this.handleClickToggleMute}
            onChangeVolume={this.handleChangeVolume}
          />
          <div className='control-bar__deck' onClick={this.handleClickDeck}>
            <ul className='control-bar__deck-selector'>
              {this.CONST_DECKS.map((deck) => (
                <li key={deck.number}
                  className={classNames('deck-selector__selector-body', {
                    active: deck.number === targetDeck,
                    'is-apollo': deck.type === 'APOLLO',
                    disabled: this.isLoading(),
                  })}
                  data-number={deck.number}
                  onClick={this.handleClickDeckTab}
                  style={deckSelectorStyle}
                >
                  <img src={deck.icon} />
                  <span className={deck.name.includes('\n') ? 'deck-selector__selector-body__multiline' : ''}>{deck.name}</span>
                </li>
              ))}
            </ul>
            <div className={classNames('deck_queue-wrapper', { 'is-apollo': isApollo })}>
              <div className="deck_queue-column">
                {this.renderArtwork()}
                {(()=>{
                  if(!this.state.deck || !this.state.deck.max_queue_size || !this.state.deck.max_add_count || !this.state.deck.max_skip_count || !this.state.deck.skip_limit_time) return null;
                  if(!this.state.isOpen) return null;
                  return (
                    <div className="queue-item__restrictions">
                      <div className="queue-item__restrictions-title">
                        <i className="fa fa-fw fa-info-circle" />
                        <span>楽曲追加・SKIPについて（実験中）</span>
                      </div>
                      <ul className="queue-item__restrictions-list">
                        <li>楽曲追加は<span className="queue-item__restrictions-num">1時間に{this.state.deck.max_add_count}回まで</span>です</li>
                        <li>SKIPの回数は<span className="queue-item__restrictions-num">1時間に{this.state.deck.max_skip_count}回まで</span>です</li>
                        <li>SKIPボタンは、<span className="queue-item__restrictions-num">楽曲が始まってから<br />{this.state.deck.skip_limit_time}秒後</span>に押せるようになります</li>
                      </ul>
                    </div>
                  );
                })()}
              </div>
              <div className="deck_queue-column deck__queue-column-list">
                {this.state.isOpen && this.renderDeckQueueCaption('- いまみんなで一緒に聞いているプレイリスト -')}
                <ul className="deck__queue">
                  {playlist.map(this.renderQueueItem)}
                  {!isTop && (
                    <li className="deck__queue-add-form">
                      {targetDeck === 346 ? (
                        <div style={{ paddingTop: '20px' }}>Pawoo Musicに曲をアップロードすると、このプレイリストに曲が追加されます。</div>
                      ) : (
                        <form onSubmit={this.handleSubmitAddForm}>
                          <span>曲を追加</span>
                          <input ref={this.setURLRef} type="text" placeholder="URLを入力 (Pawoo Music, APOLLO(BOOTH), YouTube and SoundCloud URL)" required />
                          <PlatformHelp />
                          <input type="submit" value="追加" />
                        </form>
                      )}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {!isTop && <TipsBalloonContainer id={2} style={{ left: '250px' }}>
            チャンネルの切り替え
          </TipsBalloonContainer>}
        </div>
        <div className={classNames('player-seekbar', { active: isSeekbarActive })} style={playerSeekBarStyle} />
        <div className='player-control__overlay' onClick={this.handleClickOverlay} />
      </div>
    );
  }

}

export default PlayControl;
