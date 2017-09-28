import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { refreshAccountTracks } from '../../actions/account_tracks';
import {
  register,
  rearrangeRegisteredTracks,
  unregister,
  rearrangeUnregisteredTracks,
} from '../../actions/album_compose';

const mapStateToProps = (state) => {
  const me = state.getIn(['meta', 'me']);

  return {
    me,
    tracks: state.getIn(['pawoo_music', 'account_tracks', me, 'tracks'], Immutable.Map()),
    registeredTracks: state.getIn(['pawoo_music', 'album_compose', 'registeredTracks']),
    unregisteredTracks: state.getIn(['pawoo_music', 'album_compose', 'unregisteredTracks']),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onMapId (id) {
    dispatch(refreshAccountTracks(id));
  },
  onRegister () {
    dispatch(register());
  },
  onRegisteredTracksRearrange () {
    dispatch(rearrangeRegisteredTracks());
  },
  onUnregister () {
    dispatch(unregister());
  },
  onUnregisteredTracksRearrange () {
    dispatch(rearrangeUnregisteredTracks());
  },
});

@connect(mapStateToProps, mapDispatchToProps)
export default class AlbumCompose extends ImmutablePureComponent {

  static propTypes = {
    me: PropTypes.number.isRequired,
    onMapId: PropTypes.func.isRequired,
    tracks: ImmutablePropTypes.map.isRequired,
    registeredTracks: ImmutablePropTypes.list.isRequired,
    unregisteredTracks: ImmutablePropTypes.list.isRequired,
  }

  componentWillMount () {
    this.props.onMapId(this.props.me);
  }

  componentWillReceiveProps ({ me }) {
    if (me !== this.props.me) {
      this.props.onMapId(me);
    }
  }

  handleDragEnd = ({ source, destination }) => {
    if (!source || !destination) {
      return;
    }

    if (source.droppableId === 'unregisteredTracks' && destination.droppableId === 'unregisteredTracks') {
      this.props.onUnregisteredTracksRearrange();
    } else if (source.droppableId === 'unregisteredTracks' && destination.droppableId === 'registeredTracks') {
      this.props.onRegister();
    } else if (source.droppableId === 'registeredTracks' && destination.droppableId === 'unregisteredTracks') {
      this.props.onUnregister();
    } else if (source.droppableId === 'registeredTracks' && destination.droppableId === 'registeredTracks') {
      this.props.onRegisteredTracksRearrange();
    }
  }

  render () {
    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <div>
          <section>
            <h1>Registered</h1>
            <Droppable droppableId='album_compose_registered'>
              {(provided) => (
                <div ref={provided.innerRef} style={{ height: '1em' }}>
                  {this.props.registeredTracks.map(item => (
                    <Draggable key={item} draggableId={item}>
                      {(provided) => (
                        <div>
                          <div
                            ref={provided.innerRef}
                            style={provided.draggableStyle}
                            {...provided.dragHandleProps}
                          >{this.props.tracks.getIn([item, 'title'])}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </section>
          <section>
            <h1>Unregistered</h1>
            <Droppable droppableId='album_compose_unregistered'>
              {(provided) => (
                <div ref={provided.innerRef} style={{ height: '1em' }}>
                  {this.props.unregisteredTracks.map(item => (
                    <Draggable key={item} draggableId={item}>
                      {(provided) => (
                        <div>
                          <div
                            ref={provided.innerRef}
                            style={provided.draggableStyle}
                            {...provided.dragHandleProps}
                          >{this.props.tracks.getIn([item, 'title'])}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </section>
        </div>
      </DragDropContext>
    );
  }

};
