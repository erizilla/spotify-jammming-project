import React from "react";

// this is going to be later implementation
class User extends React.Component {
    render() {
        return (
            <div>
                <h3>{this.props.name}</h3>
            </div>
        )
    }
}

export default User;