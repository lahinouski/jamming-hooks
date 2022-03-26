import React, { useEffect } from 'react';
import './PlaylistList.css';
import PlaylistListItem from '../PlaylistListItem/PlaylistListItem';

function PlaylistList(props) {
  useEffect(() => { props.getUserPlayLists() }, []); // componentDidMount()

  return (
    <div className="PlaylistList">
      <h2>Local PlayLists:</h2>
      {props.playlistList.map(playlistItem => {
        return (
          <PlaylistListItem
            playlistItem={playlistItem}
            key={playlistItem.playlistId}
            deletePlaylist={props.deletePlaylist}
          />
        );
      })}
    </div>
  );
}

export default PlaylistList;