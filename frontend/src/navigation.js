import React from "react";
import { Search, Label, Menu, Button } from "semantic-ui-react";
import _ from "lodash";

import Input from "./input";
import { withContext, RoomContext } from "./context";

class Navigation extends React.PureComponent {
    state = {
        results: [],
        search: "",
        isLoading: false
    };

    onSearch = _.debounce(async roomName => {
        const encodedRoomName = encodeURIComponent(roomName);
        const response = await fetch(`/api/rooms?name=${encodedRoomName}`);
        if (response.ok) {
            this.setState({ isLoading: false });

            const rooms = await response.json();

            const results = rooms.length
                ? rooms.map(room => ({
                      id: room.uuid,
                      title: room.name,
                      key: room.uuid
                  }))
                : [{ id: -1, title: roomName, key: -1 }];
            this.setState({ results });
        }
    }, 500);

    onSearchChange = (event, { value }) => {
        this.setState({ search: value, isLoading: true });

        if (!value) {
            return;
        }

        this.onSearch(value);
    };

    focus() {
        this.searchRef.focus();
    }

    componentDidMount() {
        this.focus();
    }

    addRoom = () => {
        const { search } = this.state;
        const { addRoom } = this.props;
        addRoom(search);
    };

    onResultSelect = (event, { result }) => {
        if (result.id === -1) {
            this.addRoom();
        } else {
            const { switchRoom } = this.props;
            switchRoom({ uuid: result.id, name: result.title });
        }
        this.setState({ search: "", results: [] });
    };

    render() {
        const { addRoom, rooms, switchRoom, currentRoom } = this.props;
        const { search, results, isLoading } = this.state;
        return (
            <Menu pointing fluid vertical>
                <Menu.Item>
                    <Search
                        input={{
                            ref: searchRef => (this.searchRef = searchRef)
                        }}
                        fluid
                        placeholder="Search rooms"
                        showNoResults={false}
                        selectFirstResult
                        onSearchChange={this.onSearchChange}
                        onResultSelect={this.onResultSelect}
                        results={results}
                        value={search}
                        loading={isLoading}
                    />
                </Menu.Item>
                {rooms.map(room => (
                    <Menu.Item
                        content={room.name}
                        name={room.name}
                        active={
                            currentRoom &&
                            room &&
                            currentRoom.uuid === room.uuid
                        }
                        key={room.uuid}
                        onClick={() => switchRoom(room)}
                    />
                ))}
            </Menu>
        );
    }
}

export default withContext(RoomContext, Navigation);
