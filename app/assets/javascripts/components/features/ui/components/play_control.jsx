import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import IconButton from '../../../components/icon_button';
import api from '../../../api';

class MusicPlayer extends React.PureComponent {

  constructor (props, context) {
    super(props, context);
    this.state = {
      isOpen: false,
      isPlaying: false,
      targetDeck: 1,
      deck: undefined
    };

    this.handleClickDeck = this.handleClickDeck.bind(this);
    this.handleClickOverlay = this.handleClickOverlay.bind(this);
    this.handleClickDeckTab = this.handleClickDeckTab.bind(this);
    this.handleSubmitAddForm = this.handleSubmitAddForm.bind(this);
    this.handleClickToggle = this.handleClickToggle.bind(this);

    this.setURLRef = this.setURLRef.bind(this);

    this.fetchDeck(1);

  }

  fetchDeck(id) {
    return new Promise((resolve, reject)=>{
      api(()=>{return{getIn:()=>{return "c2573a1973ca75534ddf7aba1222757e2a2ab372de2ac0a41ad48076d98007bb"}}}).get(`/api/v1/playlists/${id}`)
      .then((response)=>{
        this.setState({
          deck: response.data.deck
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
    this.setState({targetDeck: index});
    this.fetchDeck(index);
  }

  handleSubmitAddForm (e) {
    e.preventDefault();
    return new Promise((resolve, reject)=>{
      api(()=>{return{getIn:()=>{return "c2573a1973ca75534ddf7aba1222757e2a2ab372de2ac0a41ad48076d98007bb"}}}).post(`/api/v1/playlists`)
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

  setURLRef (c) {
    this.urlRef = c;
  }

  render () {
    const playerClass = `player-control${this.state.isOpen ? ' is-open':''}`;
    let nowPlayingArtwork = {};
    if(this.state.deck && this.state.deck.playlists.length){
      nowPlayingArtwork = {
        backgroundImage: `url(${this.state.deck.playlists[0].thumbnail_url})`
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
            <div className='control-bar__controller-skip'>
              SKIP
            </div>
            <div className='control-bar__controller-info'>
              <span className='control-bar__controller-now'>1:50</span><span className='control-bar__controller-separater'>/</span><span className='control-bar__controller-time'>4:33</span>
            </div>
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
                  if(!this.state.deck) return;
                  if(this.state.deck.playlists[0].video_url){
                    return (
                      <video autoPlay style={nowPlayingArtwork}>
                        <source src={this.state.deck.playlists[0].video_url}/>
                      </video>
                    );
                  }else{
                    return (
                      <audio autoPlay src={this.state.deck.playlists[0].music_url} />
                    );
                  }
                })()}
              </div>
              <ul className="deck__queue">
                {(()=>{
                  if(!this.state.deck) {
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

                  return this.state.deck.playlists.map((queue_item,i)=>{
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
                  })
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
