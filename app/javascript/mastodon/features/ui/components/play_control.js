import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconButton from '../../../components/icon_button';
import api from '../../../api';
import createStream from '../../../../mastodon/stream';
import YouTube from 'react-youtube';
import TipsBalloonContainer from '../../../containers/tips_balloon_container';
import TweetButton from '../../../components/tweet_button';

// FIXME: Old react style

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

class PlayControl extends React.PureComponent {

  constructor (props, context) {
    super(props, context);

    this.CONST_DECKS = [
      {number: 1, type: 'DECK', name: '共有チャンネル1', icon: '/player/pawoo-music-playlist-icon.svg'},
      {number: 2, type: 'DECK', name: '共有チャンネル2', icon: '/player/pawoo-music-playlist-icon.svg'},
      {number: 3, type: 'DECK', name: '共有チャンネル3', icon: '/player/pawoo-music-playlist-icon.svg'},
      {number: 4, type: 'DECK', name: '共有チャンネル4', icon: '/player/pawoo-music-playlist-icon.svg'},
      {number: 5, type: 'DECK', name: '共有チャンネル5', icon: '/player/pawoo-music-playlist-icon.svg'},
      {number: 6, type: 'DECK', name: '同人・ネット音楽\n専用チャンネル', icon: '/player/pawoo-music-playlist-icon.svg'},
      {number: 346, type: 'DECK', name: 'Pawoo Music\nチャンネル', icon: '/player/pawoo-music-playlist-icon.svg'},
    ];

    let targetDeck = 1;
    try { targetDeck = Number(localStorage.getItem('LATEST_DECK')) || 1; } catch (err) {}

    this.state = {
      isOpen: false,
      isPlaying: false,
      isSp: window.innerWidth < 1024,
      targetDeck,
      deck: null,
      playlist: (new Array(10)).fill(null),
      player: null,
      offset_time: 0,
      offset_start_time: 0,
      offset_counter: null,
      isSeekbarActive: false,
      isLoadingArtwork: true,
      ytControl: null,
      scControl: null,
      youtubeOpts: {},
    };

    this.scRef = null;
    this.audioRef = null;
    this.videoRef = null;

    this.subscription = null;

    this.setSCRef  = this.setSCRef.bind(this);
    this.setURLRef = this.setURLRef.bind(this);
    this.setVideoRef = this.setVideoRef.bind(this);
    this.setAudioRef = this.setAudioRef.bind(this);
    this.getMockState = this.getMockState.bind(this);
    this.handleClickSkip = this.handleClickSkip.bind(this);
    this.handleClickDeck = this.handleClickDeck.bind(this);
    this.handleClickToggle = this.handleClickToggle.bind(this);
    this.handleClickOverlay = this.handleClickOverlay.bind(this);
    this.handleClickDeckTab = this.handleClickDeckTab.bind(this);
    this.handleSubmitAddForm = this.handleSubmitAddForm.bind(this);
    this.handleClickItemLink = this.handleClickItemLink.bind(this);
    this.handleResizeWindow = this.handleResizeWindow.bind(this);
    this.onReadyYouTube = this.onReadyYouTube.bind(this);
    this.onChangeYoutubeState = this.onChangeYoutubeState.bind(this);

    this.isDeckInActive = this.isDeckInActive.bind(this);
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
            if(deck.queues.length === 1) {
              this.playNextQueueItem(deck, (new Date().getTime() / 1000));
            }
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
            if(this.state.ytControl){
              this.state.ytControl.destroy();
            }

            this.setState({
              deck,
              playlist: this.createPlaylist(deck),
              ytControl: null,
              scControl: null,
              isYoutubeLoadingDone: false,
            });
          }
          break;
        }
      },
    });
  }

  playNextQueueItem (deck, offset_start_time) {
    this.setState({
      deck,
      playlist: this.createPlaylist(deck),
      isSeekbarActive: false,
      isLoadingArtwork: true,
      offset_start_time,
      offset_time: deck.time_offset,
      youtubeOpts: (deck.queues.length && deck.queues[0].source_type === 'youtube') ? {
        playerVars: {
          autoplay: 1,
          controls: 0,
          start: deck.time_offset,
        },
      } : {},
      isYoutubeLoadingDone: false,
    });

    // YouTube / Animation用の遅延ローディング
    setTimeout(()=>{

      this.setState({
        isSeekbarActive:true,
        isLoadingArtwork: false,
      });

      // video / audioタグがレンダリングされた後に時間をシフトするための遅延ロード
      setTimeout(()=>{
        if(!deck.queues.length) return;
        switch (deck.queues[0].source_type) {
        case 'pawoo-music':
          if (this.videoRef) {
            this.videoRef.currentTime = deck.time_offset;
            this.videoRef.play();
          }
          break;

        case 'booth':
        case 'apollo':
          if (this.audioRef) {
            this.audioRef.currentTime = deck.time_offset;
            this.audioRef.play();
          }
          break;

          case 'soundcloud': {
            const widgetIframe = document.getElementById('sc-widget');
            this.setState({
              scControl: SC.Widget(widgetIframe),
            });

            this.state.scControl.bind(SC.Widget.Events.READY, ()=>{
              this.state.scControl.bind(SC.Widget.Events.PLAY, ()=>{
                this.state.scControl.getCurrentSound((currentSound)=>{
                  // SoundCloudはmilisecondsで、だいたいちょっと遅延するので+2ぐらいしとく
                  this.state.scControl.setVolume(this.state.isPlaying ? 1 : 0);
                  this.state.scControl.seekTo( (deck.time_offset+2) * 1000);
                });
              });
            });
            break;
          }
        }
      }, 400);
    }, 20);
  }

  fetchDeck(id) {
    const newState = {};
    if(this.state.ytControl){
      this.state.ytControl.destroy();
      Object.assign(newState, {
        ytControl: null,
        isYoutubeLoadingDone: false,
      });
    }
    if (this.state.scControl) {
      Object.assign(newState, {
        scControl: null,
      });
    }

    if(Object.keys(newState).length) {
      this.setState(newState);
    }


    return api(this.getMockState).get(`/api/v1/playlists/${id}`)
      .then((response)=>{
        if(this.state.offset_counter) clearInterval(this.state.offset_counter);
        const interval = setInterval(()=>{
          this.setState({
            offset_time: parseInt(new Date().getTime() / 1000) - parseInt(this.state.offset_start_time),
          });
        }, 300);
        this.setState({
          offset_counter: interval,
        });
        this.playNextQueueItem(response.data.deck, (new Date().getTime() / 1000) - response.data.deck.time_offset);
      })
      .catch((error)=>{
        this.props.onError(error);
      });
  }

  handleClickDeck () {
    this.setState({isOpen: true});
  }

  handleClickOverlay () {
    this.setState({isOpen: false});
  }

  handleClickDeckTab (e) {
    const number = Number(e.currentTarget.getAttribute('data-number'));
    if(number === this.state.targetDeck) return;
    if (this.isLoading()) return;

    try { localStorage.setItem('LATEST_DECK', number); } catch (err) {}

    this.setState({
      targetDeck: number,
      isSeekbarActive: false,
      isLoadingArtwork: true,
    });
    this.fetchDeck(number);
    this.setSubscription(number);
  }

  handleSubmitAddForm (e) {
    e.preventDefault();
    return api(this.getMockState).post(`/api/v1/playlists/${this.state.targetDeck}/deck_queues`, {link: this.urlRef.value})
      .then((response)=>{
        this.urlRef.value = "";
      })
      .catch((error)=>{
        this.props.onError(error);
      });
  }

  handleClickToggle () {
    if(this.state.ytControl){
      if(this.state.isPlaying){
        this.state.ytControl.mute();
      }else{
        this.state.ytControl.unMute();
      }
    }

    if(this.state.scControl){
      this.state.scControl.setVolume(this.state.isPlaying ? 0 : 1);
    }

    this.setState({isPlaying: (!this.state.isPlaying)});
  }

  handleClickSkip () {
    if(this.isDeckInActive() || !this.isSkipEnable()) return;
    this.props.onSkip(this.state.targetDeck, this.state.deck.queues[0].id);
  }

  handleClickItemLink (e) {
    // クリック時にDeckが開かないように
    e.stopPropagation();
  }

  handleClickTwitterShare = (e) => {
    // クリック時にDeckが開かないように
    e.stopPropagation();
  }

  handleResizeWindow (e) {
    const isSp = window.innerWidth < 1024;
    if (this.state.isSp !== isSp) {
      this.setState({ isSp });
    }
  }

  getMockState () {
    return {
      getIn: () => this.props.accessToken,
    };
  }

  setSCRef (c) {
    this.scRef = c;
  }

  setURLRef (c) {
    this.urlRef = c;
  }

  setVideoRef (c) {
    this.videoRef = c;
  }

  setAudioRef (c) {
    this.audioRef = c;
    if(this.audioRef) this.audioRef.volume = 0.8;
  }

  isDeckInActive () {
    return !this.state.deck || !("queues" in this.state.deck) || !(this.state.deck.queues.length);
  }

  isLoading () {
    return (this.state.isLoadingArtwork || (!this.isDeckInActive() && this.state.deck.queues[0].source_type === "youtube" && !this.state.isYoutubeLoadingDone));
  }

  isSkipEnable () {
    const skip_limit_time = this.state.deck && this.state.deck.skip_limit_time;
    return skip_limit_time && this.state.offset_time > skip_limit_time;
  }

  onReadyYouTube(event) {
    if(this.state.isPlaying){
      event.target.unMute();
    }else{
      event.target.mute();
    }
    this.setState({
      ytControl: event.target,
    });
  }

  // Youtubeの動画の読み込みが完了し、再生が始まると呼ばれる
  onChangeYoutubeState(e) {
    // さらにiframeにpostMessageが送られてくるまで2秒ほど待つ
    // 2秒待たない間にコンポーネントが削除されると、デベロッパーコンソールが開く
    setTimeout(() => {
      if (!this.state.isYoutubeLoadingDone) {
        this.setState({
          isYoutubeLoadingDone: true,
        });
      }
    }, 2000);
  }

  renderDeckQueueCaption(text) {
    const queueItem = this.state.deck && this.state.deck.queues && this.state.deck.queues[0];
    const shareText = `いまみんなで一緒に${queueItem ? `「${queueItem.info}」` : '音楽'}を聞きながら談話しています。`;
    return (
      <div className='deck__queue-caption'>
        <span>{text}</span>
        <div onClick={this.handleClickTwitterShare} style={{ display: 'inline-block', marginLeft: '3px', verticalAlign: 'bottom' }}>
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
            <a href={queue_item.link} target="_blank" onClick={this.handleClickItemLink}>
              <img src={`/player/logos/${queue_item.source_type}.${queue_item.source_type === 'apollo' ? 'png' : 'svg'}`} />
            </a>
          )}
        </div>
      </li>
    );
  }

  render () {
    if(this.state.isSp) return null;
    const { isTop } = this.props;
    const { playlist, targetDeck } = this.state;

    const playerClass = `player-control${this.state.isOpen ? ' is-open':''}`;
    const iconClass = `fa ${this.state.isPlaying?'fa-volume-up':'fa-play'}`;
    const toggleClass = `control-bar__controller-toggle is-${this.state.isPlaying?'playing':'pause'}`;
    const seekbarClass = `player-seekbar ${this.state.isSeekbarActive?'active':''}`;

    let playerSeekBarStyle = {};
    let nowPlayingArtwork = {};
    let ytplayerStyle = {};
    const index = this.CONST_DECKS.findIndex((deck) => deck.number === targetDeck);
    const deckSelectorStyle = {
      transform: `translate(0, -${(this.state.isOpen) ? 0 : index * 56}px)`,
    };

    if(this.state.deck && ("queues" in this.state.deck) && this.state.deck.queues.length) {
      nowPlayingArtwork = {
        backgroundImage: `url(${this.state.deck.queues[0].thumbnail_url})`,
      };
      ytplayerStyle = {
        display: this.state.deck.queues[0].source_type === 'youtube' ? 'block' : 'none',
      };

      if(this.state.isSeekbarActive){
        playerSeekBarStyle = {
          transition: `width ${this.state.isSeekbarActive ? (this.state.deck.queues[0].duration-this.state.offset_time) : '0'}s linear`,
        };
      }else{
        playerSeekBarStyle = {
          transition: `width 0s linear`,
          width: `${this.state.deck.queues[0].duration ? (this.state.offset_time / this.state.deck.queues[0].duration) * 100 : 0}%`,
        };
      }
    }

    return (
      <div className={playerClass + (this.CONST_DECKS.find(d => (d.number === targetDeck && d.type === 'APOLLO')) ? ' is-apollo':'')}>
        <div className='player-control__control-bar'>
          <div className='control-bar__controller'>
            <div className={toggleClass} onClick={this.handleClickToggle}>
              <i className={iconClass} />
            </div>
            {!isTop && <TipsBalloonContainer id={1}>
              音楽を再生！
            </TipsBalloonContainer>}

            {(()=>{
              if(isTop) {
                return null;
              }
              return (
                <div className='control-bar__controller-skip'>
                  <span className={this.isSkipEnable() ? '' : 'disabled'} onClick={this.handleClickSkip}>SKIP</span>
                </div>
              );
            })()}

            {(()=>{
              if(this.isDeckInActive() ) return null;
              return (
                <div className='control-bar__controller-info'>
                  <span className='control-bar__controller-now'>{parseInt(Math.min(this.state.offset_time, this.state.deck.queues[0].duration)/60)}:{("0"+Math.min(this.state.offset_time, this.state.deck.queues[0].duration)%60).slice(-2)}</span>
                  <span className='control-bar__controller-separater'>/</span>
                  <span className='control-bar__controller-time'>{parseInt(this.state.deck.queues[0].duration/60)}:{("0"+this.state.deck.queues[0].duration%60).slice(-2)}</span>
                </div>
              );
            })()}
          </div>
          <div className='control-bar__deck' onClick={this.handleClickDeck}>
            <ul className='control-bar__deck-selector'>
              {this.CONST_DECKS.map((deck) => (
                <li key={deck.number}
                  className={classNames('deck-selector__selector-body', {
                    active: deck.number === targetDeck,
                    'is-apollo': deck.type  === 'APOLLO',
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
            <div className={'deck_queue-wrapper'+(this.CONST_DECKS.find(d => (d.number === targetDeck && d.type === 'APOLLO')) ? ' is-apollo':'')}>
              <div className="deck_queue-column">
                <div className="queue-item__artwork" style={nowPlayingArtwork}>
                  {(()=>{

                    if(this.state.isLoadingArtwork){
                      return (
                        <div className='loading' />
                      );
                    }

                    if(this.isDeckInActive() ) return null;

                    if(this.state.deck.queues[0].source_type === 'youtube'){
                      return (
                        <YouTube
                          videoId={this.state.deck.queues[0].source_id}
                          opts={this.state.youtubeOpts}
                          onReady={this.onReadyYouTube}
                          onStateChange={this.onChangeYoutubeState}
                        />
                      );
                    }
                    if(this.state.deck.queues[0].source_type === 'soundcloud'){
                      return (
                        <iframe
                          ref={this.setSCRef}
                          id="sc-widget"
                          width="250"
                          height="250"
                          scrolling="no"
                          frameBorder="no"
                          src={
                            `https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/${this.state.deck.queues[0].source_id}&auto_play=true&liking=false&show_playcount=false&show_bpm=false&sharing=false&buying=false&show_artwork=true&show_playcount=false&show_bpm=false&show_comments=false&visual=true`
                          }
                        />
                      );
                    }

                    if(this.state.deck.queues[0].video_url){
                      return (
                        <video ref={this.setVideoRef} style={nowPlayingArtwork} muted={!this.state.isPlaying}>
                          <source src={this.state.deck.queues[0].video_url}/>
                        </video>
                      );
                    }else{
                      return (
                        <audio ref={this.setAudioRef} src={this.state.deck.queues[0].music_url} muted={!this.state.isPlaying} />
                      );
                    }
                  })()}
                </div>
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
        <div className={seekbarClass} style={playerSeekBarStyle} />
        <div className='player-control__overlay' onClick={this.handleClickOverlay} />
      </div>
    );
  }

}

PlayControl.propTypes = {
  accessToken: PropTypes.string.isRequired,
  streamingAPIBaseURL: PropTypes.string.isRequired,
  isTop: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
};

export default PlayControl;
