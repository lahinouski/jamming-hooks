import React from 'react';
import './PlaylistListItem.css';

function PlaylistListItem(props) {
	return (
		<div className="PlaylistItem" onClick={() => props.deletePlaylist(props.playlistItem)}>
			<h3>{props.playlistItem.playlistName}</h3>
			<h2>Delete</h2>
		</div>
	);
}

export default PlaylistListItem;