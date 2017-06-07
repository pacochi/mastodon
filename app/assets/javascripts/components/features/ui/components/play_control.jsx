import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import IconButton from '../../../components/icon_button';
import api from '../../../api';
import YouTubePlayer from 'youtube-player';
import createStream from '../../../../components/stream';

class MusicPlayer extends React.PureComponent {

  constructor (props, context) {
    super(props, context);
    this.state = {
      isOpen: false,
      isPlaying: false,
      targetDeck: 1,
      deck: undefined,
      player: undefined,
      offset_time: 0,
      offset_start_time: 0,
      offset_counter: undefined
    };

    this.audioRef = undefined;

    this.handleClickDeck = this.handleClickDeck.bind(this);
    this.handleClickOverlay = this.handleClickOverlay.bind(this);
    this.handleClickDeckTab = this.handleClickDeckTab.bind(this);
    this.handleSubmitAddForm = this.handleSubmitAddForm.bind(this);
    this.handleClickToggle = this.handleClickToggle.bind(this);
    this.setURLRef = this.setURLRef.bind(this);
    this.setAudioRef = this.setAudioRef.bind(this);
    this.handleClickSkip = this.handleClickSkip.bind(this);
    this.getMockState = this.getMockState.bind(this);

    this.fetchDeck(1);

    this.subscription = createStream('ws://localhost:4000/', this.props.accessToken, `playlist&deck=${this.state.targetDeck}`, {
      received (data) {
        switch(data.event) {
        case 'play':
          {
            const deck = Object.assign({},this.state.deck);
            deck.queues.shift();
            this.setState({
              deck,
              offset_start_time: (new Date().getTime() / 1000),
              offset_time: 0,
            });
          }
          break;
        case 'delete':
          {
            const payload = data.payload;
            const deck = Object.assign({},this.state.deck);
            deck.queues.push(payload);
            console.log(deck);
            this.setState({
              deck
            });
          }
          break;
        }
      }
    });
  }

  fetchDeck(id) {
    return new Promise((resolve, reject)=>{
      api(this.getMockState).get(`/api/v1/playlists/${id}`)
      .then((response)=>{
        const interval = setInterval(()=>{
          this.setState({
            offset_time: parseInt(new Date().getTime() / 1000) - parseInt(this.state.offset_start_time)
          })
        },300);
        this.setState({
          deck: response.data.deck,
          offset_start_time: (new Date().getTime() / 1000) - parseInt(response.data.deck.time_offset),
          offset_time: parseInt(response.data.deck.time_offset),
          offset_counter: interval
        })
        return resolve();
      })
      .catch((err)=>{
        return reject(err);
      })
    });
  }

  handleClickDeck () {
    this.setState({isOpen: true});
  }

  handleClickOverlay () {
    this.setState({isOpen: false});
  }

  handleClickDeckTab (index) {
    if(index === this.state.targetDeck) return;
    this.setState({targetDeck: index});
    this.fetchDeck(index);
  }

  handleSubmitAddForm (e) {
    e.preventDefault();
    return new Promise((resolve, reject)=>{
      api(this.getMockState).post(`/api/v1/playlists`)
      .then((response)=>{
        this.urlRef.value = "";
      })
      .catch((err)=>{
        return reject(err);
      })
    });
  }

  handleClickToggle () {
    this.setState({isPlaying: (!this.state.isPlaying)});
  }

  handleClickSkip () {
    api(this.getMockState).post(`/api/v1/playlists/${this.state.targetDeck}/deck_queues/${this.state.deck.queues[0].id}`)
    .then((response)=>{
    })
    .catch((err)=>{
      return err;
    })
  }

  setURLRef (c) {
    this.urlRef = c;
  }

  getMockState () {
    return {
      getIn: () => this.props.accessToken
    }
  }

  setAudioRef (c) {
    this.audioRef = c;
    if(this.audioRef) this.audioRef.volume = 0.1;
  }

  render () {
    const playerClass = `player-control${this.state.isOpen ? ' is-open':''}`;
    let nowPlayingArtwork = {};
    if(this.state.deck && ("queue" in this.state.deck) && this.state.deck.queues.length) {
      nowPlayingArtwork = {
        backgroundImage: `url(${this.state.deck.queues[0].thumbnail_url})`
      };
    }

    return (
      <div className={playerClass}>
        <div className='player-control__control-bar'>
          <div className='control-bar__controller'>
            {(()=>{
              if(this.state.isPlaying){
                return (
                  <div className='control-bar__controller-toggle is-playing' onClick={this.handleClickToggle}>
                    <i className="fa fa-play" />
                  </div>
                )
              }else{
                return (
                  <div className='control-bar__controller-toggle is-pause' onClick={this.handleClickToggle}>
                    <i className="fa fa-pause" />
                  </div>
                )
              }
            })()}
            <div className='control-bar__controller-skip' onClick={this.handleClickSkip}>
              SKIP
            </div>
            {(()=>{
              if(!this.state.deck || !("queue" in this.state.deck) || !(this.state.deck.queues.length) ) return;
              return (
                <div className='control-bar__controller-info'>
                  <span className='control-bar__controller-now'>{parseInt(this.state.offset_time/60)}:{("0"+this.state.offset_time%60).slice(-2)}</span>
                  <span className='control-bar__controller-separater'>/</span>
                  <span className='control-bar__controller-time'>{parseInt(this.state.deck.queues[0].duration/60)}:{("0"+this.state.deck.queues[0].duration%60).slice(-2)}</span>
                </div>
              );
            })()}
          </div>
          <div className='control-bar__deck' onClick={this.handleClickDeck}>
            <ul className='control-bar__deck-selector'>
              {(()=>[1,2,3].map(index=>(
                <li key={index} className={'deck-selector__selector-body'+(this.state.targetDeck === index ? ' active':'')} onClick={()=>{this.handleClickDeckTab(index)}}>
                  <img src="/player/pawoo-music-playlist-icon.svg" /><span>DECK{index}</span>
                </li>
              )))()}
            </ul>
            <div className="deck_queue-wrapper">
              <div className="queue-item__artwork" style={nowPlayingArtwork}>
                {(()=>{
                  if(!this.state.deck || !("queue" in this.state.deck) || !(this.state.deck.queues.length) ) return;

                  if(this.state.deck.queues[0].source_type == 'youtube'){
                    const url = `https://www.youtube.com/embed/${this.state.deck.queues[0].source_id}?autoplay=1&rel=0&amp;controls=0&amp;showinfo=0`;
                    return (
                      <iframe width="560" height="315" src={url} frameBorder="0" allowFullScreen />
                    );
                  }

                  if(this.state.deck.queues[0].video_url){
                    return (
                      <video autoPlay style={nowPlayingArtwork}>
                        <source src={this.state.deck.queues[0].video_url}/>
                      </video>
                    );
                  }else{
                    return (
                      <audio ref={this.setAudioRef} autoPlay src={this.state.deck.queues[0].music_url} />
                    );
                  }
                })()}
              </div>
              <ul className="deck__queue">
                {(()=>{
                  if(!this.state.deck || !("queue" in this.state.deck) || !(this.state.deck.queues.length) ){
                    return (
                      <li className="deck__queue-item">
                        <div className="queue-item__main">
                          <div className='queue-item__metadata'>
                            プレイリストに曲がありません
                          </div>
                        </div>
                        <div className='queue-item__datasource'>
                        </div>
                      </li>
                    );
                  }

                  return this.state.deck.queues.map((queue_item,i)=>{
                    return (
                      <li key={i} className="deck__queue-item">
                        <div className="queue-item__main">
                          <div className='queue-item__metadata'>
                            {queue_item.info}
                          </div>
                        </div>
                        <div className='queue-item__datasource'>
                          <a href={queue_item.link} target="_blank"><img src={(()=>`/player/logos/${queue_item.source_type}.svg`)()} /></a>
                        </div>
                      </li>
                    );
                  });

                })()}
                <li className="deck__queue-add-form">
                  <form onSubmit={this.handleSubmitAddForm}>
                    <span>曲を追加</span>
                    <input ref={this.setURLRef} type="text" placeholder="URLを入力(Pawoo Music, APPOLO(BOOTH) and YouTube URL)" />
                    <input type="submit" />
                  </form>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='player-control__overlay' onClick={this.handleClickOverlay} />
      </div>
    );
  }

}

export default MusicPlayer;
