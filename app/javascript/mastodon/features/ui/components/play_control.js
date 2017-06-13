import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import IconButton from '../../../components/icon_button';
import api from '../../../api';
import createStream from '../../../../mastodon/stream';
import YouTube from 'react-youtube';

// FIXME: Old react style

class MusicPlayer extends React.PureComponent {

  constructor (props, context) {
    super(props, context);
    this.state = {
      isOpen: false,
      isPlaying: false,
      targetDeck: 1,
      deck: null,
      player: null,
      offset_time: 0,
      offset_start_time: 0,
      offset_counter: null,
      isSeekbarActive: false,
      isLoadingArtwork: true,
      ytControl: null,
      youtubeOpts: {},
    };

    this.audioRef = null;
    this.videoRef = null;
    this.subscription = null;

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
    this.onReadyYouTube = this.onReadyYouTube.bind(this);
    this.onChangeYoutubeState = this.onChangeYoutubeState.bind(this);

    this.isDeckInActive = this.isDeckInActive.bind(this);
  }

  componentDidMount () {
    this.fetchDeck(1);
    this.setSubscription(1);
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
              ytControl: null,
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
          case 'pawoo-music': {
            this.videoRef.currentTime = deck.time_offset;
          }
            break;
          case 'booth':
          case 'apollo': {
            this.audioRef.currentTime = deck.time_offset;
          }
            break;
        }
      }, 400);
    }, 20);
  }

  fetchDeck(id) {
    if(this.state.ytControl){
      this.state.ytControl.destroy();
      this.setState({
        ytControl: null,
        isYoutubeLoadingDone: false,
      });
    }

    return new Promise((resolve, reject)=>{
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
        return reject(error);
      });
    });
  }

  handleClickDeck () {
    this.setState({isOpen: true});
  }

  handleClickOverlay () {
    this.setState({isOpen: false});
  }

  handleClickDeckTab (e) {
    const index = Number(e.currentTarget.getAttribute('data-index'));
    if(index === this.state.targetDeck) return;
    if (this.isLoading()) return;

    this.setState({
      targetDeck: index,
      isSeekbarActive: false,
      isLoadingArtwork: true,
    });
    this.fetchDeck(index);
    this.setSubscription(index);
  }

  handleSubmitAddForm (e) {
    e.preventDefault();
    return new Promise((resolve, reject)=>{
      api(this.getMockState).post(`/api/v1/playlists/${this.state.targetDeck}/deck_queues`, {link: this.urlRef.value})
      .then((response)=>{
        this.urlRef.value = "";
      })
      .catch((error)=>{
        this.props.onError(error);
        return reject(error);
      });
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
    this.setState({isPlaying: (!this.state.isPlaying)});
  }

  handleClickSkip () {
    if(this.isDeckInActive()) return;
    api(this.getMockState).delete(`/api/v1/playlists/${this.state.targetDeck}/deck_queues/${this.state.deck.queues[0].id}`)
    .then((response)=>{
    })
    .catch((error)=>{
      this.props.onError(error);
      return error;
    });
  }

  setURLRef (c) {
    this.urlRef = c;
  }

  getMockState () {
    return {
      getIn: () => this.props.accessToken,
    };
  }

  setVideoRef (c) {
    this.videoRef = c;
  }

  setAudioRef (c) {
    this.audioRef = c;
    if(this.audioRef) this.audioRef.volume = 0.1;
  }

  isDeckInActive () {
    return !this.state.deck || !("queues" in this.state.deck) || !(this.state.deck.queues.length);
  }

  isLoading () {
    return (this.state.isLoadingArtwork || (!this.isDeckInActive() && this.state.deck.queues[0].source_type === "youtube" && !this.state.isYoutubeLoadingDone));
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

  render () {
    const playerClass = `player-control${this.state.isOpen ? ' is-open':''}`;
    const iconClass = `fa fa-volume-${this.state.isPlaying?'up':'off'}`;
    const toggleClass = `control-bar__controller-toggle is-${this.state.isPlaying?'playing':'pause'}`;
    const seekbarClass = `player-seekbar ${this.state.isSeekbarActive?'active':''}`;

    let playerSeekBarStyle = {};
    let nowPlayingArtwork = {};
    let ytplayerStyle = {};
    const deckStyle = {
      transform: `translate(0, -${(!this.state.isOpen) ? (this.state.targetDeck-1)*56 : 0}px)`,
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
      <div className={playerClass}>
        <div className='player-control__control-bar'>
          <div className='control-bar__controller'>
            <div className={toggleClass} onClick={this.handleClickToggle}>
              <i className={iconClass} />
            </div>

            {(()=>{
              if(this.props.isTop) {
                return null;
              }
              return (
                <div className='control-bar__controller-skip' onClick={this.handleClickSkip}>
                  SKIP
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
            <ul className='control-bar__deck-selector' style={deckStyle}>
              {(()=>[1, 2, 3].map(index=>(
                <li key={index} className={'deck-selector__selector-body'+(this.state.targetDeck === index ? ' active':'') + (this.isLoading() ? ' disabled' : '')} data-index={index} onClick={this.handleClickDeckTab}>
                  <img src="/player/pawoo-music-playlist-icon.svg" /><span>DECK{index}</span>
                </li>
              )))()}
            </ul>
            <div className="deck_queue-wrapper">
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

                  if(this.state.deck.queues[0].video_url){
                    return (
                      <video ref={this.setVideoRef} autoPlay style={nowPlayingArtwork} muted={!this.state.isPlaying}>
                        <source src={this.state.deck.queues[0].video_url}/>
                      </video>
                    );
                  }else{
                    return (
                      <audio ref={this.setAudioRef} autoPlay src={this.state.deck.queues[0].music_url} muted={!this.state.isPlaying} />
                    );
                  }
                })()}
              </div>
              <ul className="deck__queue">
                {(()=>{
                  if(this.isDeckInActive() ){
                    return (
                      <li className="deck__queue-item">
                        <div className="queue-item__main">
                          <div className='queue-item__metadata'>
                            プレイリストに曲がありません
                          </div>
                        </div>
                        <div className='queue-item__datasource' />
                      </li>
                    );
                  }

                  return this.state.deck.queues.map(queue_item=>(
                      <li key={queue_item.id} className="deck__queue-item">
                        <div className="queue-item__main">
                          <div className='queue-item__metadata'>
                            <span className='queue-item__metadata-title'>{queue_item.info.length > 40 ? `${queue_item.info.slice(0, 40)}……` : queue_item.info}</span>
                          </div>
                        </div>
                        <div className='queue-item__datasource'>
                          <a href={queue_item.link} target="_blank"><img src={`/player/logos/${queue_item.source_type}.${queue_item.source_type === 'apollo' ? 'png' : 'svg'}`} /></a>
                        </div>
                      </li>
                    )
                  );
                })()}
                {(()=>{
                  if(this.props.isTop) {
                    return null;
                  }
                  return (
                    <li className="deck__queue-add-form">
                      <form onSubmit={this.handleSubmitAddForm}>
                        <span>曲を追加</span>
                        <input ref={this.setURLRef} type="text" placeholder="URLを入力(Pawoo Music, APOLLO(BOOTH) and YouTube URL)" required />
                        <div className='deck__queue-add-form-help'>
                          <i className='fa fa-question-circle deck__queue-add-form-help-icon' />
                          <div className='deck__queue-add-form-help-popup'>
                            <h3>対応プラットフォーム</h3>
                            <ul>
                              <li>
                                <img src="/player/logos/pawoo-music.svg" />
                                <div className='platform-info'>
                                  <div className='platform-info__title'>Pawoo Music</div>
                                  <div className='platform-info__url'>https://music.pawoo.net/web/statuses/[XXXXX…]</div>
                                </div>
                              </li>
                              <li>
                                <img src="/player/logos/youtube.svg" />
                                <div className='platform-info'>
                                  <div className='platform-info__title'>YouTube</div>
                                  <div className='platform-info__url'>https://www.youtube.com/watch?v=[XXXXX...]</div>
                                </div>
                              </li>
                              <li>
                                <img src="/player/logos/booth.svg" />
                                <div className='platform-info'>
                                  <div className='platform-info__title'>BOOTH</div>
                                  <div className='platform-info__url'>https://booth.pm/ja/items/[XXXXX...]</div>
                                </div>
                              </li>
                              <li>
                                <img src="/player/logos/apollo.png" />
                                <div className='platform-info'>
                                  <div className='platform-info__title'>APOLLO</div>
                                  <div className='platform-info__url'>https://booth.pm/apollo/a06/item?id=[XXXXX...]</div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <input type="submit" />
                      </form>
                    </li>
                  );
                })()}
              </ul>
            </div>
          </div>
        </div>
        <div className={seekbarClass} style={playerSeekBarStyle} />
        <div className='player-control__overlay' onClick={this.handleClickOverlay} />
      </div>
    );
  }

}

MusicPlayer.propTypes = {
  accessToken: PropTypes.string.isRequired,
  streamingAPIBaseURL: PropTypes.string.isRequired,
  isTop: PropTypes.bool.isRequired,
  onError: PropTypes.func.isRequired,
};

export default MusicPlayer;
