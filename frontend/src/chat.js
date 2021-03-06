import React from "react";
import io from "socket.io-client";
import styled from "styled-components";
import { List } from "immutable";

import { RoomContext, ChatContext, UserContext, withContext } from "./context";
import Navigation from "./navigation";
import Content from "./content";
import Footer from "./footer";
import Header from "./header";
import { post } from "./api";

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

const HeaderContainer = styled.div`
    grid-area: header;
`;

const FooterContainer = styled.div`
    grid-area: footer;
`;

const ContentContainer = styled.div`
    grid-area: content;
    overflow-y: hidden;
`;

const NavigationContainer = styled.div`
    grid-area: navigation;
`;

class Chat extends React.PureComponent {
    switchRoom = async room => {
        const { currentRoom: oldRoom, rooms } = this.state;
        const { user } = this.props;

        const chat = await this.fetchChat(room.uuid);

        const roomIdToFind = room.uuid;
        if (!rooms.find(room => room.uuid === roomIdToFind)) {
            this.setState({ rooms: rooms.push(room) });
        }

        this.setState({ chat: List(chat), currentRoom: room });
        this.socket.emit("switchRoom", {
            user,
            previousRoom: oldRoom,
            currentRoom: room
        });
    };

    addRoom = async name => {
        if (!name) {
            return;
        }

        const response = await post("/api/room", { name });
        const room = await response.json();
        this.setState({ rooms: this.state.rooms.push(room) });
        this.switchRoom(room);
    };

    addMessage = (message, username) => {
        if (!message) {
            return;
        }

        this.socket.emit("message", {
            room: this.state.currentRoom,
            sender: username,
            message
        });
    };

    state = {
        rooms: List(),
        chat: List(),
        currentRoom: null,
        addRoom: this.addRoom,
        switchRoom: this.switchRoom,
        addMessage: this.addMessage
    };

    async fetchRooms() {
        const response = await fetch("/api/rooms");
        const rooms = await response.json();
        return rooms;
    }

    async fetchChat(roomId) {
        const response = await fetch(`/api/chat/${roomId}`);
        const chat = await response.json();
        return chat;
    }

    onMessage = chat => {
        this.setState({ chat: this.state.chat.push(chat) });
    };

    onConnect = () => {
        const { user } = this.props;
        const { currentRoom } = this.state;
        if (currentRoom) {
            this.socket.emit("switchRoom", { user, currentRoom });
        }
    };

    async componentDidMount() {
        this.socket = io();
        this.socket.on("message", this.onMessage);
        this.socket.on("connect", this.onConnect);
    }

    getRoomContext() {
        const { rooms, currentRoom, addRoom, switchRoom } = this.state;
        return { rooms, currentRoom, addRoom, switchRoom };
    }

    getChatContext() {
        const { chat, addMessage } = this.state;
        return { chat, addMessage };
    }

    render() {
        return (
            <RoomContext.Provider value={this.getRoomContext()}>
                <ChatContext.Provider value={this.getChatContext()}>
                    <Container>
                        <HeaderContainer>
                            <Header />
                        </HeaderContainer>
                        <NavigationContainer>
                            <Navigation />
                        </NavigationContainer>
                        <ContentContainer>
                            <Content />
                        </ContentContainer>
                        <FooterContainer>
                            <Footer />
                        </FooterContainer>
                    </Container>
                </ChatContext.Provider>
            </RoomContext.Provider>
        );
    }
}

export default withContext(UserContext, Chat);
