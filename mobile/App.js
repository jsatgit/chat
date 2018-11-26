/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { GiftedChat } from 'react-native-gifted-chat'
import { SafeAreaView } from 'react-native';


type Props = {};

export default class App extends Component<Props> {
    state = {
        messages: [],
    }

    async componentWillMount() {
        const result = await fetch("http://stoma.xyz/api/chat/a5a73fac-b84c-4777-b687-8d2d84af36aa")
        const convo = await result.json();
        this.setState({
            messages: convo.map((convo, index) => ({
                _id: index,
                text: convo.message,
                user: { 
                    _id: convo.sender,
                    name: convo.sender 
                }
            }))
        })
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'stretch',
                marginHorizontal: 10
            }}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: "jshi",
                    }}
                />
            </SafeAreaView>
        )
    }
}
