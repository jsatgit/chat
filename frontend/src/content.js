import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

function formatChat({sender, message}) {
    return `${sender}: ${message}`;
}

const Container = styled.div`
    overflow-y: scroll;
    height: 100%;
`;

export default class Content extends React.PureComponent {
    scrollToBottom() {
        const element = ReactDOM.findDOMNode(this.element);
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    render() {
        return (
            <Container ref={element => this.element = element}>
                {this.props.chat.map((chat, index) => (
                    <div key={index}>
                        {formatChat(chat)}
                    </div>
                ))}
            </Container>
        );
    }
}
