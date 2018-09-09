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
            const results = rooms.map(room => ({ id: room.id, title: room.name }))
            this.setState({results})
        }
    })

    onSearchChange = (event, {value}) => {
        this.setState({search: value});

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

    getNoResultsMessage() {
        const { search } = this.state;
        return <Button onClick={this.addRoom}>Add {search}</Button>;
    }

    onResultSelect = (event, { result }) => {
        const { switchRoom } = this.props;
        switchRoom({id: result.id, name: result.title});
    }

    render() {
        const { addRoom, rooms, switchRoom, currentRoom } = this.props;
        const { search, results } = this.state;
        return (
            <Menu pointing fluid vertical>
                <Menu.Item>
                    <Search 
                        fluid 
                        noResultsMessage={this.getNoResultsMessage()}
                        placeholder="Search rooms"
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
