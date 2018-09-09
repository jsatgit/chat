import React from "react";
import { Search, Label, Menu } from "semantic-ui-react";
import _ from "lodash";

import Input from "./input";
import { withContext, RoomContext } from "./context";

class Navigation extends React.PureComponent {
    state = {
        results: []
    }

    onSearchChange = async (event, {value}) => {
        if (!value) {
            return;
        }

        const encodedRoomName = encodeURIComponent(value);
        const response = await fetch(`/api/rooms?name=${encodedRoomName}`);
        if (response.ok) {
            const rooms = await response.json()
            const results = rooms.map(room => ({ id: room.id, title: room.name }))
            this.setState({results})
        }
    }

    onResultSelect = (event, { result }) => {
        const { switchRoom } = this.props;
        switchRoom({id: result.id, name: result.title});
    }

    render() {
        const { addRoom, rooms, switchRoom, currentRoom } = this.props;
        return (
            <Menu pointing fluid vertical>
                <Menu.Item>
                    <Search 
                        fluid 
                        noResultsMessage="no results found"
                        placeholder="Search rooms"
                        onSearchChange={_.debounce(this.onSearchChange, 500)}
                        onResultSelect={this.onResultSelect}
                        results={this.state.results}
                    />
                </Menu.Item>
                {rooms.map((room, index) => (
                    <Menu.Item
                        name={room.name}
                        active={currentRoom && room && currentRoom.id === room.id}
                        key={index}
                        onClick={() => switchRoom(room)}
                    />
                ))}
            </Menu>
        );
    }
}

export default withContext(RoomContext, Navigation);
