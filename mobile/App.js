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

export default class App extends Component {

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

    async componentDidMount() {
        this.socket = SocketIOClient("http://stoma.xyz");
        this.socket.on("message", this.onMessage)
        this.socket.emit("switchRoom", {
            user: {
                name: "jshi"
            },
            currentRoom: {
                uuid: "a5a73fac-b84c-4777-b687-8d2d84af36aa",
                name: "stoma"
            },
        })

        const result = await fetch("http://stoma.xyz/api/chat/a5a73fac-b84c-4777-b687-8d2d84af36aa")
        const convo = await result.json();
        convo.reverse();
        this.setState({
            isLoadingEarlier: false,
            messages: convo.map(mapConvoToMessage)
        })
    }

    onSend(messages = []) {
        messages.forEach(message => {
            const { user, text } = message;
            this.socket.emit("message", {
                room: {
                    uuid: "a5a73fac-b84c-4777-b687-8d2d84af36aa",
                    name: "stoma"
                },
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
