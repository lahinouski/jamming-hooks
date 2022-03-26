import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

function Playlist(props) {
  return (
    <div className="Playlist">
      <h3>Edit playlist name:</h3>
      <input
        onChange={(event) => props.onNameChange(event.target.value)}
        value={props.playlistName} />
      <TrackList
        tracks={props.playlistTracks}
        onRemove={props.onRemove}
        isRemoval={true} />
      <a
        className="Playlist-save"
        onClick={props.onSave}>SAVE TO SPOTIFY</a>
    </div>
  );
}

export default Playlist;