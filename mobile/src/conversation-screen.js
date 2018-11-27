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

export default class ConversationScreen extends Component {

    state = {
        isLoadingEarlier: true,
        messages: [],
    }

    static navigationOptions = ({ navigation }) => {
        const room = navigation.getParam('room');
        return {
            title: room.name,
        };
    };

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

    getUser() {
        const { navigation } = this.props; 
        return navigation.getParam('user', {});
    }

    async componentDidMount() {
        const room = this.getCurrentRoom();
        const user = this.getUser();
        this.socket = SocketIOClient("http://stoma.xyz");
        this.socket.on("message", this.onMessage)
        this.socket.emit("joinRoom", {
            user: {
                name: user.name 
            },
            room,
        })

        const result = await fetch(`http://stoma.xyz/api/chat/${room.uuid}`)
        const convo = await result.json();
        convo.reverse();
        this.setState({
            isLoadingEarlier: false,
            messages: convo.map(mapConvoToMessage)
        })
    }

    componentWillUnmount() {
        const user = this.getUser();
        this.socket.emit("leaveRoom", {
            user: {
                name: user.name
            },
            room: this.getCurrentRoom(),
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
        const user = this.getUser();

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <GiftedChat
                    isLoadingEarlier={isLoadingEarlier}
                    messages={messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: user.name,
                    }}
                />
            </SafeAreaView>
        )
    }
}
