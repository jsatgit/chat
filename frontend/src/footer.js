import React from "react";
import styled from "styled-components";

import Input from "./input";
import { withContext, ChatContext, UserContext, RoomContext } from "./context";

const Container = styled.div`
    margin-left: 20px;
    margin-right: 20px;
    height: 100%;
`;

class Footer extends React.Component {
    shouldComponentUpdate(nextProps) {
        return this.props.currentRoom !== nextProps.currentRoom;
    }

    render() {
        const { user, addMessage, currentRoom } = this.props;
        return (
            <Container>
                { currentRoom &&
                    <Input
                        forceFocus
                        placeholder={`Message ${currentRoom.name} room`}
                        onSubmit={message => addMessage(message, user.name)}
                    />
                }
            </Container>
        );
    }
}

export default withContext(
    RoomContext,
    withContext(UserContext, withContext(ChatContext, Footer))
);
