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

async function searchRooms(roomName) {
    const encodedRoomName = encodeURIComponent(roomName);
    const response = await fetch(
        `http://stoma.xyz/api/rooms?name=${encodedRoomName}`
    );
    return await response.json();
}

export default class HomeScreen extends Component {
    state = {
        isLoading: false,
        isSearching: false,
        roomsFound: [],
        rooms: []
    };

    getUser() {
        const { navigation } = this.props;
        return navigation.getParam("user", {});
    }

    startSearch() {
        this.setState({ isLoading: true, isSearching: true });
    }

    endSearch(roomsFound=[]) {
        this.setState({ isLoading: false, roomsFound});
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', this.screenWillFocus);
    }

    screenWillFocus = () => {
        this.setState({ isSearching: false });
    }

    _onChangeText = async roomName => {
        if (!roomName) {
            this.endSearch();
            return;
        }

        this.startSearch();

        const rooms = await searchRooms(roomName);
        const roomsFound = rooms.length ? rooms : [{name: roomName}];

        this.endSearch(roomsFound);
    };

    onChangeText = debounce(this._onChangeText, 500);

    goToConversation(room) {
        const { navigation } = this.props;
        navigation.navigate("Conversation", {
            room,
            user: this.getUser()
        });
    }

    onSearchListItemPress = async (room) => {
        this.search.clear();

        const { rooms } = this.state;
        const roomToEnter = room.uuid ? room : await createRoom(room.name);
        const newRooms = rooms.find(existingRoom => existingRoom.uuid === room.uuid) ? rooms : [...rooms, roomToEnter];

        this.setState(
            { rooms: newRooms, },
            () => this.goToConversation(roomToEnter)
        );
    }

    renderSearchList() {
        const { roomsFound } = this.state;
        return roomsFound.map((room, i) => (
            <ListItem
                key={i}
                onPress={() => this.onSearchListItemPress(room)}
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
                    placeholder="Search rooms..."
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
