import React from "react";


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