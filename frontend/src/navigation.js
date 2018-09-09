import React from "react";
import { Search, Label, Menu, Button } from "semantic-ui-react";
import _ from "lodash";

import Input from "./input";
import { withContext, RoomContext } from "./context";

class Navigation extends React.PureComponent {
    state = {
        results: [],
        search: "",
    }

    onSearch = _.debounce(async (roomName) => {
        const encodedRoomName = encodeURIComponent(roomName);
        const response = await fetch(`/api/rooms?name=${encodedRoomName}`);
        if (response.ok) {
            const rooms = await response.json()
            if (rooms.length) {
                const results = rooms.map(room => ({ id: room.id, title: room.name }))
                this.setState({results})
            }
        }
    })

    onSearchChange = (event, {value}) => {
        this.setState({search: value, results: [{id: -1, title: value}]});

        if (!value) {
            return;
        }

        this.onSearch(value);
    }

    addRoom = () => {
        const { search } = this.state;
        const { addRoom } = this.props;
        addRoom(search);
        this.setState({search: ""});
    }

    onResultSelect = (event, { result }) => {
        if (result.id === -1) {
            this.addRoom();
        } else {
            const { switchRoom } = this.props;
            switchRoom({id: result.id, name: result.title});
        }
    }

    render() {
        const { addRoom, rooms, switchRoom, currentRoom } = this.props;
        const { search, results } = this.state;
        return (
            <Menu pointing fluid vertical>
                <Menu.Item>
                    <Search 
                        fluid 
                        placeholder="Search rooms"
                        showNoResults={false}
                        selectFirstResult
                        onSearchChange={this.onSearchChange}
                        onResultSelect={this.onResultSelect}
                        results={results}
                        value={search}
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
