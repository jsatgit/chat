import React, { Component } from "react";
import { SafeAreaView, View } from "react-native";
import { SearchBar, ListItem } from "react-native-elements";
import debounce from "debounce";

async function createRoom(name) {
    const response = await fetch(`http://stoma.xyz/api/room`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name })
    });

    if (!response.ok) {
        throw `unable to create room ${name}`;
    }

    return await response.json();
}

export default class HomeScreen extends Component {
    state = {
        isLoading: false,
        isSearching: false,
        searchRooms: [],
        rooms: []
    };

    getUser() {
        const { navigation } = this.props;
        return navigation.getParam("user", {});
    }

    _onChangeText = async roomName => {
        if (!roomName) {
            this.setState({ isSearching: false });
            return;
        }

        const foundRoom = this.state.rooms.find(room => room.name === roomName);
        if (foundRoom) {
            this.setState({ searchRooms: [foundRoom] });
            return;
        }

        this.setState({ isLoading: true, isSearching: true });
        const encodedRoomName = encodeURIComponent(roomName);
        const response = await fetch(
            `http://stoma.xyz/api/rooms?name=${encodedRoomName}`
        );
        const rooms = await response.json();

        const searchRooms = rooms.length > 0 ? rooms : [{ name: roomName }];

        this.setState({ searchRooms, isLoading: false });
    };

    onChangeText = debounce(this._onChangeText, 500);

    renderSearchList() {
        const { navigation } = this.props;
        const { rooms, searchRooms } = this.state;
        return searchRooms.map((room, i) => (
            <ListItem
                key={i}
                onPress={async () => {
                    this.search.clear();
                    if (!room.uuid) {
                        try {
                            const createdRoom = await createRoom(room.name);
                            this.setState(
                                {
                                    rooms: [...rooms, createdRoom],
                                    isSearching: false
                                },
                                () => {
                                    navigation.navigate("Conversation", {
                                        room: createdRoom,
                                        user: this.getUser()
                                    });
                                }
                            );
                        } catch (error) {
                            this.setState({ isSearching: false });
                        }

                        return;
                    }
                    const newRooms = rooms.find(
                        existingRoom => existingRoom.name === room
                    )
                        ? rooms
                        : [...rooms, room];

                    this.setState(
                        { rooms: newRooms, isSearching: false },
                        () => {
                            navigation.navigate("Conversation", {
                                room,
                                user: this.getUser()
                            });
                        }
                    );
                }}
                title={room.name}
            />
        ));
    }

    renderRoomList() {
        const { navigation } = this.props;
        const { rooms } = this.state;

        return rooms.map((room, i) => (
            <ListItem
                key={i}
                onPress={() => navigation.navigate("Conversation", { room })}
                title={room.name}
            />
        ));
    }

    render() {
        const { isLoading, isSearching } = this.state;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <SearchBar
                    ref={search => (this.search = search)}
                    containerStyle={{
                        height: 50,
                        backgroundColor: "transparent",
                        borderTopWidth: 0,
                        borderBottomWidth: 0
                    }}
                    round
                    inputContainerStyle={{ backgroundColor: "#e4e5ee" }}
                    inputStyle={{ backgroundColor: "#e4e5ee" }}
                    onChangeText={this.onChangeText}
                    placeholder="Search..."
                    showLoading={isLoading}
                />
                <View>
                    {isSearching
                        ? this.renderSearchList()
                        : this.renderRoomList()}
                </View>
            </SafeAreaView>
        );
    }
}
