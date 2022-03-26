import React, { useState } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import PlaylistList from '../PlaylistList/PlaylistList';
import Spotify from '../../util/Spotify';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistList, setPlaylistList] = useState([]);

  function addTrack(track) {
    let songInPlaylist = false;
    for (let i = 0; i < playlistTracks.length; i++) {
      if (track.id === playlistTracks[i].id) {
        songInPlaylist = true;
      }
    }
    if (!songInPlaylist) {
      const newPlaylist = playlistTracks.concat(); // Returns a shallow copy
      newPlaylist.push(track);
      setPlaylistTracks(newPlaylist);
    }
  }

  function removeTrack(track) {
    const newPlaylist = playlistTracks.filter(song => song.id !== track.id);
    setPlaylistTracks(newPlaylist);
  }

  function savePlaylist() {
    const trackUris = playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(playlistName, trackUris)
      .then(() => getUserPlayLists());
    setPlaylistName('New Playlist');
    setPlaylistTracks([]);
  }

  function deletePlaylist(playlist) {
    Spotify.deletePlaylistById(playlist.playlistId)
      .then(() => getUserPlayLists());
  }

  function getUserPlayLists() {
    Spotify.getUserPlayLists()
      .then(playlists => setPlaylistList(playlists));
  }

  function search(searchTerm) {
    Spotify.search(searchTerm)
      .then(tracks => setSearchResults(tracks));
  }

  Spotify.getAccessToken();
  return (
    <div>
      <h1>Ja<span className="highlight">mmmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          <SearchResults
            searchResults={searchResults}
            onAdd={addTrack} />
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onRemove={removeTrack}
            onNameChange={(name) => setPlaylistName(name)}
            onSave={savePlaylist} />
        </div>
        <PlaylistList
          getUserPlayLists={getUserPlayLists}
          playlistList={playlistList}
          deletePlaylist={deletePlaylist}
        />
      </div>
    </div>
  );
}

export default App;