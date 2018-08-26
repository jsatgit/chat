import React from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import { List } from 'immutable';

import Nav from './navigation';
import Context from './context';
import Cont from './content';
import Foot from './footer';
import { post } from './api';

const Container = styled.div`
    display: grid; 
    width: 100%;
    height: 100%;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 75px 1fr 75px;
    grid-template-areas:
    "navigation header"
    "navigation content"
    "navigation footer";
`;

const Header = styled.div`
    grid-area: header;
`;

const Footer = styled.div`
    grid-area: footer;
`;

const Content = styled.div`
    grid-area: content;
    overflow-y: hidden;
`;

const Navigation= styled.div`
     grid-area: navigation;
`;

export default class Chat extends React.PureComponent {
    addRoom = async (name) => {
        const response = await post('/api/room', { name});
        const room = await response.json();
        this.setState({rooms: this.state.rooms.push(room)})
    }

    addMessage = (message, username) => {
        this.socket.emit('message', {
            room: this.state.currentRoom.id,
            sender: username,
            message,
        });
    }

    switchRoom = async (room) => {
        const chat = await this.fetchChat(room.id)
        this.setState({chat: List(chat), currentRoom: room});
        this.socket.emit('joinRoom', {
            previousRoom: this.state.currentRoom,
            currentRoom: room, 
        })
    }
    
    state = {
        rooms: List(),
        chat: List(),
        currentRoom: null,
        addRoom: this.addRoom,
        switchRoom: this.switchRoom,
        addMessage: this.addMessage,
    }

    async fetchRooms() {
        const response = await fetch('/api/rooms');
        const rooms = await response.json();
        return rooms;
    }

    async fetchChat(roomId) {
        const response = await fetch(`/api/chat/${roomId}`);
        const chat = await response.json();
        return chat;
    }

    onMessage = (chat) => {
        this.setState({chat: this.state.chat.push(chat)})
    }

    async componentDidMount() {
        this.socket = io();
        this.socket.on('message', this.onMessage);
        const rooms = await this.fetchRooms();
        const [room] = rooms;
        this.switchRoom(room);
        this.setState({rooms: List(rooms)});
    }

    render() {
        return (
            <Context.Provider value={this.state} >
                <Container>
                    <Header>
                    </Header>
                    <Navigation>
                        <Nav rooms={this.state.rooms}/>
                    </Navigation>
                    <Content ref={outputElement => this.outputElement = outputElement} >
                        <Cont key={this.state.chat} chat={this.state.chat} />
                    </Content>
                    <Footer>
                        <Foot user={this.state.user}/>
                    </Footer>
                </Container>
            </Context.Provider>
        );
    }
}
