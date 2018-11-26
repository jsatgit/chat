import React, { Component } from "react";
import { SafeAreaView, View  } from 'react-native';
import { SearchBar, ListItem  } from 'react-native-elements'
import debounce from 'debounce';

export default class HomeScreen extends Component {
    state = {
        isLoading: false, 
        rooms: []
    }

    _onChangeText = async (roomName) => {
        this.setState({isLoading: true});
        const encodedRoomName = encodeURIComponent(roomName);
        const results = await fetch(`http://stoma.xyz/api/rooms?name=${encodedRoomName}`);
        const rooms = await results.json()
        this.setState({rooms, isLoading: false});
    }

    onChangeText = debounce(this._onChangeText, 500);

    render() {
        const { rooms, isLoading } = this.state;
        const { navigation } = this.props;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <SearchBar
                    containerStyle={{
                        height: 50,
                        backgroundColor:'transparent',
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                    }}
                    round
                    inputContainerStyle={{backgroundColor: "#e4e5ee"}}
                    inputStyle={{backgroundColor: "#e4e5ee"}}
                    onChangeText={this.onChangeText}
                    placeholder='Search...' 
                    showLoading={isLoading}
                />
                <View>
                    {
                        rooms.map((room, i) => (
                            <ListItem
                                key={i}
                                onPress={() => navigation.navigate('Conversation', {room})}
                                title={room.name}
                            />
                        ))
                    }
                </View>
            </SafeAreaView>
        );
    }
}
