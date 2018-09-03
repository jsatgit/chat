import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { Button, Comment, Form, Header } from "semantic-ui-react";

import { ChatContext, withContext } from "./context";

const Container = styled.div`
    overflow-y: scroll;
    height: 100%;
    margin-left: 20px;
`;

const formatChat = (chat, index) => (
    <Comment key={index}>
        <Comment.Content>
            <Comment.Author as="a">{chat.sender}</Comment.Author>
            <Comment.Text>{chat.message}</Comment.Text>
        </Comment.Content>
    </Comment>
);

class Content extends React.PureComponent {
    scrollToBottom() {
        const element = ReactDOM.findDOMNode(this.element);
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    render() {
        const { chat } = this.props;
        return (
            <Container ref={element => (this.element = element)}>
                <Comment.Group>{chat.map(formatChat)}</Comment.Group>
            </Container>
        );
    }
}

export default withContext(ChatContext, Content);
