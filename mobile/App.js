/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Button, KeyboardAvoidingView, SafeAreaView, ScrollView } from 'react-native';

const content = [1,2,3,4,5,6,7,8,9,10]

type Props = {};

const styles = {
    container: {
        flex: 1
    },
    keyboardAvoidContainer: {
        flex: 1,
        backgroundColor: 'orange'
    }
}

export default class App extends Component<Props> {
    state = {
        text: "",
        convos: [],
    };

    async componentDidMount() {
        const result = await fetch("http://stoma.xyz/api/chat/1");
        const convos = await result.json();
        this.setState({convos});
    }

    onPress = () => {
        const { convos, text } = this.state;
        this.setState({
            text: "",
            convos: [...convos, {sender: "james", message: text}],
        })
    };

    render() {
        const { convos, text } = this.state;

        return (
            <SafeAreaView style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'stretch',
                marginHorizontal: 10
            }}>
                <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
                    <ScrollView 
                        style={{flex: 1}}
                        ref={ref => this.scrollView = ref}
                        onContentSizeChange={(contentWidth, contentHeight)=> {
                            this.scrollView.scrollToEnd({animated: true});
                        }}
                    >
                        {convos.map((convo, index) => {
                            return <Text style={{padding: 2, fontSize: 14}} key={index}>{convo.message}</Text>;
                        })}
                    </ScrollView>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <TextInput 
                            style={{
                                height: 30,
                                flex: 1,
                                borderLeftWidth: 1,
                                borderRightWidth: 1,
                                borderTopWidth: 1,
                                borderBottomWidth: 1,
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                borderBottomRightRadius: 10,
                                borderBottomLeftRadius: 10,
                                borderColor: '#F2F2F2',
                                backgroundColor: "#F2F2F2"
                            }}
                            value={text}
                            multiline
                            placeholder="Type here"
                            onChangeText={(text) => this.setState({text})}
                        />
                        <Button
                            title="Send"
                            style={{width: 50}}
                            onPress={this.onPress}
                        />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}
