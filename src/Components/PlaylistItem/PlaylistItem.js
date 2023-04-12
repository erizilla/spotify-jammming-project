import React from "react";

class PlaylistItem extends React.Component {

    render() {
        return (
            <div className="PlaylistItem">
                <h3>{this.props.playlistName}</h3>
            </div>
        )
    }
}
export default PlaylistItem;