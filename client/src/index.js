import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { List } from 'immutable';
import styled from 'styled-components';
import { GoogleLogin } from 'react-google-login';
import Cookies from 'js-cookie';

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
    overflow-y: scroll;
`;

const Navigation= styled.div`
     grid-area: navigation;
`;

const Output = styled.div`
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
        signupPage: false,
        authenticating: true,
        rooms: List(),
        currentRoom: 'main',
    }

    onInputChange = (event) => {
        this.setState({inputValue: event.target.value}); 
    }

    onKeyPress = (event) => {
        if (event.key === 'Enter') {
            const val = this.state.inputValue;
            this.socket.emit('message', {
                room: this.state.currentRoom,
                sender: this.state.id,
                message: val,
            })
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

    onJoin = name => {
        const text = `${name} joined the chat.`
        this.setState({ messages: this.state.messages.push(text) })
    }

    onLoadRooms = rooms => {
        this.setState({rooms: List(rooms)});
    }

    componentDidMount() {
        this.socket = io();
        this.socket.on('message', this.onMessage);
        this.socket.on('load', this.onLoad);
        this.socket.on('join', this.onJoin);
        this.socket.on('login', this.onLoginSuccess);
        this.socket.on('loadRooms', this.onLoadRooms);

        const token = Cookies.get('token');
        if (token) {
            this.join(token);
        } else {
            this.setState({authenticating: false, signupPage: true});
        }
    }

    onLoginSuccess = ({name, token}) => {
        Cookies.set('token', token, { expires: 1 });
        this.setState({id: name, authenticating: false, signupPage: false});
        this.socket.emit('joinRoom', null, this.state.currentRoom);
    }

    join(token) {
        this.socket.emit('join', token);
    }

    onSignIn = (googleUser) => {
        const token = googleUser.getAuthResponse().id_token;
        this.join(token);
    }

    renderSignupPage() {
        return (
            <div>
                <GoogleLogin
                    clientId="320665311927-28nv44ac7jfmbf3g4sejkt616c6gtqms.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={this.onSignIn}
                    onFailure={console.log}
                />
            </div>
        );
    }

    onAddRoomKeyPress = (event) => {
        if (event.key === 'Enter') {
            const roomName = event.target.value;
            this.socket.emit('addRoom', roomName);
        }
    }

    onRoomClick = (name) => {
        this.socket.emit('joinRoom', this.state.currentRoom, name);
        this.setState({currentRoom: name});
    }

	render() {
        if (this.state.authenticating) {
            return <div>Loading</div>;
        }

        if (this.state.signupPage) {
            return this.renderSignupPage()
        }

        return (
            <Container>
                <Header>
                </Header>
                <Navigation>
                    Add room <input onKeyPress={this.onAddRoomKeyPress} />
                    {this.state.rooms.map((room, index) => (
                        <div key={index} onClick={() => this.onRoomClick(room.name)}>
                            {room.name}
                        </div>
                    ))}
                </Navigation>
                <Content ref={outputElement => this.outputElement = outputElement} >
                    {this.state.messages.map((message, index) => (
                        <div key={index}>
                            {message}
                        </div>
                    ))}
                </Content>
                <Footer>
                    {`${this.state.id} `}
                    <input 
                        onChange={this.onInputChange}
                        onKeyPress={this.onKeyPress}
                        value={this.state.inputValue}
                    />
                </Footer>
            </Container>
        );
	}
}

ReactDOM.render(<App/>, document.getElementById("root"));
