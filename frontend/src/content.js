import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { ChatContext, withContext } from './context';

function formatChat({sender, message}) {
    return `${sender}: ${message}`;
}

const Container = styled.div`
    overflow-y: scroll;
    height: 100%;
`;

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
            <Container ref={element => this.element = element}>
                {chat.map((chat, index) => (
                    <div key={index}>
                        {formatChat(chat)}
                    </div>
                ))}
            </Container>
        );
    }
}

export default withContext(ChatContext, Content);
