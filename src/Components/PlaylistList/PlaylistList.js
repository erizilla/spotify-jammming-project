import React from "react";
import PlaylistItem from "../PlaylistItem/PlaylistItem";

class PlaylistList extends React.Component {

    render() {
        return (
            <div className="PlaylistList">
                <h2>Your Playlist</h2>

                {this.props.playlists.map(playlist => {
                    return(
                        <PlaylistItem
                            name={playlist.playlistName}
                            key={playlist.playlistId}
                            />
                    )
                })}
                {/* {console.log(this.props.playlistName)} */}
            </div>
        )
    }
}
export default PlaylistList;