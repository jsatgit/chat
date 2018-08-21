import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { List } from 'immutable';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const Output = styled.div`
    height: 100%;
    overflow-y: scroll;
`;

const Input = styled.div`
`;

function formatLine({sender, message}) {
    return `${sender}: ${message}`;
}

class App extends React.PureComponent {
    state = {
        id: null,
        inputValue: "",
        messages: List(),
        signupPage: true,
    }

    onInputChange = (event) => {
        this.setState({inputValue: event.target.value}); 
    }

    onKeyPress = (event) => {
        if (event.key === 'Enter') {
            const val = this.state.inputValue;
            this.socket.emit('message', {sender: this.state.id, message: val})
            this.setState({inputValue: ""})
        }
    }

    scrollToBottom() {
        const outputElement = ReactDOM.findDOMNode(this.outputElement);
        if (outputElement) {
            outputElement.scrollTop = outputElement.scrollHeight;
        }
    }

    onMessage = (line) => {
        const text = formatLine(line);
        this.setState({messages: this.state.messages.push(text)}, () => {
            this.scrollToBottom();
        })  
    }

    onLoad = ({messages}) => {
        this.setState({ messages: List(messages.map(formatLine)) })
    }

    onJoin = user => {
        const text = `${user} joined the chat.`
        this.setState({ messages: this.state.messages.push(text) })
    }

    componentDidMount() {
        this.socket = io();
        this.socket.on('message', this.onMessage);
        this.socket.on('load', this.onLoad);
        this.socket.on('join', this.onJoin);
    }

    onUsernameKeyPress = (event) => {
        if (event.key === 'Enter') {
            const user = event.target.value;
            this.setState({id: user, signupPage: false});
            this.socket.emit('join', user);
        }
    }

    renderSignupPage() {
        return (
            <div>
                Pick your username
                <input 
                    onKeyPress={this.onUsernameKeyPress}
                />
            </div>
        );
    }

	render() {
        if (this.state.signupPage) {
            return this.renderSignupPage()
        }

        return (
            <Container>
                <Output
                    ref={outputElement => this.outputElement = outputElement}
                >
                    {this.state.messages.map((message, index) => (
                        <div key={index}>
                            {message}
                        </div>
                    ))}
                </Output>
                <Input>
                    {`${this.state.id} `}
                    <input 
                        onChange={this.onInputChange}
                        onKeyPress={this.onKeyPress}
                        value={this.state.inputValue}
                    />
                </Input>
            </Container>
        );
	}
}

ReactDOM.render(<App/>, document.getElementById("root"));
