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
        inputValue: "",
        messages: List(),
    }

    onInputChange = (event) => {
        this.setState({inputValue: event.target.value}); 
    }

    onKeyPress = (event) => {
        if (event.key === 'Enter') {
            const val = this.state.inputValue;
            this.socket.emit('message', val)
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

    onLoad = (messages) => {
        this.setState({messages: List(messages.map(formatLine))})
    }

    componentDidMount() {
        this.socket = io();
        this.socket.on('message', this.onMessage);
        this.socket.on('load', this.onLoad);
    }

	render() {
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
                    What is on your mind 
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
