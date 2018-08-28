import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { Redirect } from 'react-router';
import Cookies from 'js-cookie';

import { post } from './api';
import { withContext, UserContext } from './context';

class Login extends React.PureComponent {
    state = {
        authenticated: false,
    }

    onLogin = async (googleUser, updateUser) => {
        const token = googleUser.getAuthResponse().id_token;
        this.authenticate(token);
    }

    async authenticate(token) {
        const response = await post('/api/login', {token});
        if (response.ok) {
            const user = await response.json();
            Cookies.set('chat-token', token, { expires: 1 });
            this.props.updateUser(user);
            this.setState({authenticated: true});
        }
    }

    componentDidMount() {
        const token = Cookies.get('chat-token')
        if (token) {
            this.authenticate(token)
        }
    }

    render() {
        if (this.state.authenticated) {
            return <Redirect to='/chat' />
        }

        return (
            <GoogleLogin
                clientId="320665311927-28nv44ac7jfmbf3g4sejkt616c6gtqms.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={googleUser => this.onLogin(googleUser)}
                onFailure={console.error}
            />
        );
    }
}

export default withContext(UserContext, Login);
