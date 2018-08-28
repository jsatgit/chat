import React from "react";

import { withContext, RoomContext } from "./context";

class Header extends React.PureComponent {
    render() {
        const { currentRoom } = this.props;
        return <div>{currentRoom && currentRoom.name}</div>;
    }
}

export default withContext(RoomContext, Header);
