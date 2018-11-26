import React, {Component} from 'react';
import { GiftedChat } from 'react-native-gifted-chat'
import { SafeAreaView } from 'react-native';
import SocketIOClient from 'socket.io-client';
import uuid from 'uuid/v4';

const mapConvoToMessage = (convo) => ({
    _id: uuid(),
    text: convo.message,
    user: {
        _id: convo.sender, 
        name: convo.sender,
    }
})

export default class Conversation extends Component {

    state = {
        isLoadingEarlier: true,
        messages: [],
    }

    onMessage = chat => {
        const message = mapConvoToMessage(chat)
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, [message]),
        }))
    }

    getCurrentRoom() {
        const { navigation } = this.props; 
        return navigation.getParam('room', {});
    }

    async componentDidMount() {
        const currentRoom = this.getCurrentRoom();
        this.socket = SocketIOClient("http://stoma.xyz");
        this.socket.on("message", this.onMessage)
        this.socket.emit("switchRoom", {
            user: {
                name: "jshi"
            },
            currentRoom,
        })

        const result = await fetch(`http://stoma.xyz/api/chat/${currentRoom.uuid}`)
        const convo = await result.json();
        convo.reverse();
        this.setState({
            isLoadingEarlier: false,
            messages: convo.map(mapConvoToMessage)
        })
    }

    onSend(messages = []) {
        const room = this.getCurrentRoom();
        messages.forEach(message => {
            const { user, text } = message;
            this.socket.emit("message", {
                room,
                sender: user._id,
                message: text, 
            });
        })
    }

    render() {
        const { isLoadingEarlier, messages } = this.state;

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <GiftedChat
                    isLoadingEarlier={isLoadingEarlier}
                    messages={messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: "jshi",
                    }}
                />
            </SafeAreaView>
        )
    }
}
