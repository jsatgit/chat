import React from "react";
import { Label, Menu } from "semantic-ui-react";

import Input from "./input";
import { withContext, RoomContext } from "./context";

class Navigation extends React.PureComponent {
    render() {
        const { addRoom, rooms, switchRoom, currentRoom } = this.props;
        return (
            <Menu pointing fluid vertical>
                <Menu.Item>
                    <Input
                        submitButtonIcon="add"
                        placeholder="room name"
                        onSubmit={addRoom}
                    />
                </Menu.Item>
                {rooms.map((room, index) => (
                    <Menu.Item
                        name={room.name}
                        active={currentRoom === room}
                        key={index}
                        onClick={() => switchRoom(room)}
                    />
                ))}
            </Menu>
        );
    }
}

export default withContext(RoomContext, Navigation);
