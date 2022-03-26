let accessToken = '';
let expiresIn;
let userId;
const clientId = 'ae15c8569ccd4845847e370ba0478aae';
const redirectUri = 'http://lahinouski-jamming.surge.sh';
// const redirectUri = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if (accessToken !== '') {
      return accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      const Url = window.location.href;
      const tokenArray = Url.match(/access_token=([^&]*)/);
      const expiresInArray = Url.match(/expires_in=([^&]*)/);
      accessToken = tokenArray[1];
      expiresIn = expiresInArray[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    }
  },

  search(searchTerm) {
    this.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, { headers: headers })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request failed!');
      }, networkError => console.log(networkError.message))
      .then(jsonResponse => {
        if (jsonResponse.tracks) {
          return jsonResponse.tracks.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri,
              artwork: track.album.images[2].url,
              sample: track.preview_url
            }
          })
        } else {
          return [];
        }
      });
  },

  getUserId() {
    const headers = { Authorization: `Bearer ${accessToken}` };
    return fetch('https://api.spotify.com/v1/me', { headers: headers })
      .then(response => response.json())
      .then(jsonResponse => {
        userId = jsonResponse.id;
        return userId;
      });
  },

  getPlaylistId(userId, playlistName) {
    const headers = { Authorization: `Bearer ${accessToken}` };
    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({ name: playlistName })
    })
      .then(response => response.json())
      .then(jsonResponse => jsonResponse.id);
  },

  createPlaylist(userId, playlistId, trackUris) {
    const headers = { Authorization: `Bearer ${accessToken}` };
    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({ uris: trackUris })
    })
      .then(response => response.json())
      .then(jsonResponse => jsonResponse.id);
  },

  savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris.length) {
      return;
    }
    return this.getUserId()
      .then(userId => this.getPlaylistId(userId, playlistName))
      .then(playlistId => this.createPlaylist(userId, playlistId, trackUris));
  },

  getUserPlayLists() {
    const headers = { Authorization: `Bearer ${accessToken}` };
    return this.getUserId()
      .then(() => fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'GET',
        headers: headers
      }))
      .then(response => response.json())
      .then(jsonResponse => {
        if (!jsonResponse.items) {
          return [];
        } else {
          return jsonResponse.items.map(item => ({
            playlistId: item.id,
            playlistName: item.name
          }));
        }
      });
  },

  deletePlaylistById(playlistId) {
    const headers = { Authorization: `Bearer ${accessToken}` };
    return this.getUserId()
      .then(userId => fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/followers`, {
        method: 'DELETE',
        headers: headers
      }));
  }
};

export default Spotify;
