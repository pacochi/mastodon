import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import IconButton from '../../../components/icon_button';

class MusicPlayer extends React.PureComponent {

  constructor (props, context) {
    super(props, context);
    this.state = {
      isOpen: false,
      targetDeck: 1
    };

    this.handleClickDeck = this.handleClickDeck.bind(this);
    this.handleClickOverlay = this.handleClickOverlay.bind(this);
    this.handleClickDeckTab = this.handleClickDeckTab.bind(this);
  }

  handleClickDeck () {
    this.setState({isOpen: true});
  }

  handleClickOverlay () {
    this.setState({isOpen: false});
  }

  handleClickDeckTab (index) {
    this.setState({targetDeck: index});
  }

  render () {
    const playerClass = `player-control${this.state.isOpen ? ' is-open':''}`;

    return (
      <div className={playerClass}>
        <div className='player-control__control-bar'>
          <div className='control-bar__controller'>
            <div className='control-bar__controller-toggle'>
              <i className="fa fa-play" />
            </div>
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
              <div className="queue-item__artwork" />
              <ul className="deck__queue">
                <li className="deck__queue-item">
                  <div className="queue-item__main">
                    <div className='queue-item__metadata'>
                      <span>fishpond</span>
                      -
                      <span>水曜日　午前9時　はじまりのおと</span>
                    </div>
                  </div>
                  <div className='queue-item__datasource'>
                    <img src="/player/logos/booth.svg" />
                  </div>
                </li>
                <li className="deck__queue-item">
                  <div className="queue-item__main">
                    <div className='queue-item__metadata'>
                      <span>fishpond</span>
                      -
                      <span>水曜日　午前9時　はじまりのおと</span>
                    </div>
                  </div>
                  <div className='queue-item__datasource'>
                    <img src="/player/logos/booth.svg" />
                  </div>
                </li>
                <li className="deck__queue-item">
                  <div className="queue-item__main">
                    <div className='queue-item__metadata'>
                      <span>fishpond</span>
                      -
                      <span>水曜日　午前9時　はじまりのおと</span>
                    </div>
                  </div>
                  <div className='queue-item__datasource'>
                    <img src="/player/logos/booth.svg" />
                  </div>
                </li>
                <li className="deck__queue-item">
                  <div className="queue-item__main">
                    <div className='queue-item__metadata'>
                      <span>fishpond</span>
                      -
                      <span>水曜日　午前9時　はじまりのおと</span>
                    </div>
                  </div>
                  <div className='queue-item__datasource'>
                    <img src="/player/logos/booth.svg" />
                  </div>
                </li>
                <li className="deck__queue-item">
                  <div className="queue-item__main">
                    <div className='queue-item__metadata'>
                      <span>fishpond</span>
                      -
                      <span>水曜日　午前9時　はじまりのおと</span>
                    </div>
                  </div>
                  <div className='queue-item__datasource'>
                    <img src="/player/logos/booth.svg" />
                  </div>
                </li>
                <li className="deck__queue-item">
                  <div className="queue-item__main">
                    <div className='queue-item__metadata'>
                      <span>fishpond</span>
                      -
                      <span>水曜日　午前9時　はじまりのおと</span>
                    </div>
                  </div>
                  <div className='queue-item__datasource'>
                    <img src="/player/logos/booth.svg" />
                  </div>
                </li>
                <li className="deck__queue-item">
                  <div className="queue-item__main">
                    <div className='queue-item__metadata'>
                      <span>fishpond</span>
                      ー
                      <span>水曜日　午前9時　はじまりのおと</span>
                    </div>
                  </div>
                  <div className='queue-item__datasource'>
                    <img src="/player/logos/booth.svg" />
                  </div>
                </li>
                <li className="deck__queue-item">
                  <div className="queue-item__main">
                    <div className='queue-item__metadata'>
                      <span>fishpond</span>
                      ー
                      <span>水曜日　午前9時　はじまりのおと</span>
                    </div>
                  </div>
                  <div className='queue-item__datasource'>
                    <img src="/player/logos/booth.svg" />
                  </div>
                </li>
                <li className="deck__queue-item">
                  <div className="queue-item__main">
                    <div className='queue-item__metadata'>
                      <span>fishpond</span>
                      ー
                      <span>水曜日　午前9時　はじまりのおと</span>
                    </div>
                  </div>
                  <div className='queue-item__datasource'>
                    <img src="/player/logos/booth.svg" />
                  </div>
                </li>
                <li className="deck__queue-item">
                  <div className="queue-item__main">
                    <div className='queue-item__metadata'>
                      <span>fishpond</span>
                      ー
                      <span>水曜日　午前9時　はじまりのおと</span>
                    </div>
                  </div>
                  <div className='queue-item__datasource'>
                    <img src="/player/logos/booth.svg" />
                  </div>
                </li>
                <li className="deck__queue-add-form">
                  <form>
                    <span>曲を追加</span>
                    <input type="text" placeholder="URLを入力(Pawoo Music, APPOLO(BOOTH) and YouTube URL)" />
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
