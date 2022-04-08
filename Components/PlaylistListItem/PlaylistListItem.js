import React from 'react';
import './PlaylistListItem.css';

function PlaylistListItem(props) {
	function confirmDeletion() {
		const confirmed = confirm(`Remove «${props.playlistItem.playlistName}» from your Spotify account?`);
		if (confirmed) props.deletePlaylist(props.playlistItem);
	}

	return (
		<div className="PlaylistItem" onClick={confirmDeletion}>
			<h3>{props.playlistItem.playlistName}</h3>
			<h2>Delete</h2>
		</div>
	);
}

export default PlaylistListItem;